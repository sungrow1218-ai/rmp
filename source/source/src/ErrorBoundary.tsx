import React, { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
}

interface State {
  hasError: boolean;
  errorMessage: string;
  errorDetails: string;
  errorInfo?: ErrorInfo;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { 
      hasError: false, 
      errorMessage: '', 
      errorDetails: '' 
    };
  }

  static getDerivedStateFromError(error: Error): Partial<State> {
    return { 
      hasError: true, 
      errorMessage: error.message || 'An unexpected error occurred',
      errorDetails: error.stack || ''
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    this.setState({ errorInfo });
    
    console.error('ErrorBoundary caught an error:', error);
    console.error('Component instance:', errorInfo);
    console.error('Error info:', errorInfo);
    
    // Notify parent window
    window.parent.postMessage({
      source: 'ai-coding-template',
      type: 'javascript-error',
      error: error.toString(),
      filename: '',
      lineno: 0,
      colno: 0,
      stack: error.stack || '',
    }, '*');
    
    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }
  }

  handleRetry = () => {
    this.setState({ 
      hasError: false, 
      errorMessage: '', 
      errorDetails: '',
      errorInfo: undefined 
    });
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return <>{this.props.fallback}</>;
      }

      return (
        <div className="flex justify-center items-center min-h-[400px] p-8">
          <div className="max-w-md text-center bg-red-50 border border-red-200 rounded-lg p-8 shadow-lg">
            <div className="text-red-600 mb-4 flex justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10"></circle>
                <line x1="12" y1="8" x2="12" y2="12"></line>
                <line x1="12" y1="16" x2="12.01" y2="16"></line>
              </svg>
            </div>
            <h2 className="text-red-800 text-2xl font-semibold mb-2">出现错误</h2>
            <p className="text-red-700 mb-4 leading-relaxed">{this.state.errorMessage}</p>
            
            {this.state.errorDetails && (
              <div className="mb-6 text-left">
                <details className="bg-white border border-gray-200 rounded p-2">
                  <summary className="cursor-pointer font-medium text-gray-700 p-1">错误详情</summary>
                  <pre className="mt-2 p-2 bg-gray-50 rounded text-sm text-gray-600 overflow-x-auto whitespace-pre-wrap break-words">
                    {this.state.errorDetails}
                  </pre>
                </details>
              </div>
            )}
            
            <div className="flex gap-4 justify-center">
              <button 
                onClick={this.handleRetry}
                className="px-4 py-2 rounded font-medium cursor-pointer transition-all bg-red-600 text-white border border-red-600 hover:bg-red-700 hover:border-red-700"
              >
                重试
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}