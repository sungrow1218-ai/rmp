import {
  defineConfig,
  mergeConfig,
  UserConfig,
  PluginOption,
  Plugin,
  loadEnv,
} from "vite";
import { join } from "path";
import react from "@vitejs/plugin-react";
import ViteRestart from "vite-plugin-restart";

export default defineConfig(({ mode, command }) => {
  const root = __dirname;
  const env = loadEnv(mode, root);
  const isPreview = mode === "preview";
  const entry = "App.tsx";

  const plugins: PluginOption[] = [
    ViteRestart({
      restart: "restart",
      reload: "reload",
    }),
    ErrorWatcherPlugin(),
  ];

  plugins.push(react());

  const opts: UserConfig = {
    base: "/",
    css: {
      preprocessorOptions: {
        less: {
          // @ht/sprite-ui needs this
          javascriptEnabled: true,
        },
      },
    },
    plugins,
    root,
    envDir: root,
    resolve: {
      alias: {
        "@": join(root, "src"),
      },
    },
    build: {
      outDir: join(root, "dist"),
      minify: false,
    },
    server: {
      proxy: {
        '/rmp/api': {
          target: env.VITE_PROXY_API_TARGET || 'http://10.102.82.119:1080',
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/rmp\/api/, ''),
        },
        '/rmp/aegis/api': {
          target: env.VITE_PROXY_AEGIS_TARGET || 'http://10.102.82.119:11084',
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/rmp\/aegis\/api/, ''),
        },
      },
    },
  };

  if (command === "build" && !isPreview) {
    return mergeConfig(opts, {
      build: {
        lib: {
          entry: `src/${entry}`,
          name: "ai-coding-component",
          fileName: "index",
          formats: ["es"],
        },
        rollupOptions: {
          external: ["react", "react/jsx-runtime", "react-dom"],
          output: {
            exports: "named",
          },
        },
      },
    } satisfies Partial<UserConfig>);
  }
  return opts;
});

const ErrorWatcherPlugin: () => Plugin = () => {
  return {
    name: "vite-plugin-error-watcher",
    transformIndexHtml(html: string) {
      return {
        html,
        tags: [
          {
            tag: "script",
            injectTo: "head",
            children: `
              (function() {
                // Global error handler - runs before any other JS
                window.addEventListener('error', function(event) {
                  console.error('Global error caught:', event.error);

                  window.parent.postMessage({
                    source: 'ai-coding-template',
                    type: 'javascript-error',
                    error: event.error ? event.error.toString() : event.message,
                    filename: event.filename,
                    lineno: event.lineno,
                    colno: event.colno,
                    stack: event.error ? event.error.stack : '',
                  }, '*');
                });

                // Global unhandled rejection handler
                window.addEventListener('unhandledrejection', function(event) {
                  console.error('Unhandled promise rejection:', event.reason);

                  const error = event.reason;
                  window.parent.postMessage({
                    source: 'ai-coding-template',
                    type: 'javascript-error',
                    error: error ? error.toString() : 'Unhandled promise rejection',
                    filename: '',
                    lineno: 0,
                    colno: 0,
                    stack: error ? error.stack || '' : '',
                  }, '*');
                });
              })();
            `,
          },
          {
            tag: "script",
            injectTo: "body",
            children: `
              (function() {
                const TARGET_SELECTOR = 'vite-error-overlay';

                function checkAndAlert(node) {
                  const children = node.shadowRoot.querySelector('.window').children;
                  const text = [];
                  for (const el of children) {
                    if (!el.classList.contains('tip')) {
                      text.push(el.innerText)
                    }
                  }

                  window.parent.postMessage({
                    source: 'ai-coding-template',
                    type: 'vite-error',
                    error: text.join('\\n'),
                  }, '*');
                }

                // 1. 检查页面加载时是否已经存在
                if (document.querySelector(TARGET_SELECTOR)) {
                  checkAndAlert(document.querySelector(TARGET_SELECTOR));
                }

                // 2. 创建观察者监听后续的 DOM 变动
                const observer = new MutationObserver((mutations) => {
                  for (const mutation of mutations) {
                    if (mutation.addedNodes.length) {
                      for (const node of mutation.addedNodes) {
                        if (node.nodeType === 1) {
                          if (node.matches(TARGET_SELECTOR)) {
                            checkAndAlert(node);
                            return;
                          }
                        }
                      }
                    }
                  }
                });

                observer.observe(document.body, {
                  childList: true,
                  subtree: true
                });
              })();
            `,
          },
        ],
      };
    },
  };
};

// Trigger restart