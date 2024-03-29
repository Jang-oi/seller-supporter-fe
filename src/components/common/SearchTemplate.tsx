import { Box, Button, Input } from '@mui/joy';
import { useRecoilState, useResetRecoilState, useSetRecoilState } from 'recoil';
import { SnackbarType } from './MadaSnackbar';
import { snackbarState } from '../../recoil/snackbar/atom';
import { useState } from 'react';
import LoadingComponent from './LoadingComponent';
import { axiosAPI } from '../../utils/axios';
import {keywordDataState, reviewDataState, shoppingDataState} from '../../recoil/shoppingData/atom';

const SearchTemplate = () => {
  const [searchValue, setSearchValue] = useState<string>('');
  const [snackbarOption, setSnackbarOption] = useRecoilState<SnackbarType>(snackbarState);
  const [isLoading, setIsLoading] = useState(false);
  const setShoppingData = useSetRecoilState(shoppingDataState);
  const resetShoppingData = useResetRecoilState(shoppingDataState);

  const resetReviewData = useResetRecoilState(reviewDataState);
  const resetKeywordData = useResetRecoilState(keywordDataState);

  const onSearchButtonHandler = () => {
    if (!searchValue) {
      setSnackbarOption({ ...snackbarOption, open: true, isError: true, message: '검색어를 입력해주세요.' });
    } else {
      resetShoppingData();
      resetReviewData();
      resetKeywordData();
      setIsLoading(true);
      axiosAPI('/getShoppingList', { searchValue })
        .then((res) => {
          const response = res.data;
          setSnackbarOption({
            ...snackbarOption,
            open: true,
            isError: response.returnCode < 0,
            message: response.returnMsg,
          });
          setShoppingData(response.data);
        })
        .catch()
        .finally(() => setIsLoading(false));
    }
  };

  const handleOnKeyPress = (e: any) => {
    if (e.key === 'Enter') {
      onSearchButtonHandler();
    }
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <Input
        sx={{ '--Input-decoratorChildHeight': '45px', width: '40vw' }}
        placeholder="상품명을 검색하세요."
        required
        value={searchValue}
        onKeyDown={handleOnKeyPress}
        onChange={(event) => {
          setSearchValue(event.target.value);
        }}
        endDecorator={
          <Button disabled={isLoading} variant="solid" color="primary" onClick={onSearchButtonHandler}>
            검색
          </Button>
        }
      />
      {isLoading && <LoadingComponent />}
    </Box>
  );
};

export default SearchTemplate;
