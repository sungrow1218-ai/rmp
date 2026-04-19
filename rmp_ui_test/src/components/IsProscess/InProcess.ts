import { queryInProgress } from '@/services/process';
import { message } from '@ht/sprite-ui';

const isProgress = async (changeModule: number, changeItemId: number) => {
  try {
    const result = await queryInProgress({
      changeModule,
      changeItemId,
    });

    if (result.code !== 0) {
      // message.error({
      //   content: `${result.message}`,
      // });
      return null;
    }
    if (result.data?.resultList && result.data?.resultList.length > 0) {
      return result.data.resultList;
    }
    return null;
  } catch (error) {
    return null;
  }
};

export { isProgress };
