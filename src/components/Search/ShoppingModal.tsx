import React, { useEffect } from 'react';
import {
  Modal,
  Tab,
  ModalDialog,
  ModalClose,
  Sheet,
  Tabs,
  TabList,
  ListItemDecorator,
  TabPanel,
  Typography,
} from '@mui/joy';
import { useRecoilState } from 'recoil';
import { shoppingDetailModalState } from '../../recoil/shoppingData/atom';
import { openNewTab } from '../../utils/commonUits';
import ReviewTemplate from './ReviewTemplate';
import RateReviewIcon from '@mui/icons-material/RateReview';
import SearchIcon from '@mui/icons-material/Search';
import KeywordTemplate from './KeywordTemplate';
import ButtonBase from '@mui/material/ButtonBase';
import useLicenseCheck from '../../hooks/useLicenseCheck';
import LoadingComponent from '../common/LoadingComponent';

const ShoppingModal = () => {
  const [shoppingDetailModal, setShoppingDetailModal] = useRecoilState(shoppingDetailModalState);
  const { showModal, shoppingDetailData } = shoppingDetailModal as any;
  const { productTitle, mallProductUrl } = shoppingDetailData;

  const onModalCloseHandler = (_event: React.MouseEvent<HTMLButtonElement>, reason: string) => {
    if (reason === 'closeClick') {
      setShoppingDetailModal({ ...shoppingDetailModal, showModal: false });
    }
  };

  const { checkLicense, isLoading } = useLicenseCheck();
  useEffect(() => {
    checkLicense();
  }, []);
  if (isLoading) return <LoadingComponent />;

  return (
    <Modal
      open={showModal}
      onClose={onModalCloseHandler}
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Sheet variant="outlined" sx={{ borderRadius: 'md', p: 3, minWidth: '70vw', minHeight: '60vh' }}>
        <ModalDialog sx={{ overflow: 'scroll', width: '100%', height: '100%', alignItems: 'center' }} variant={'plain'}>
          <ModalClose variant={'plain'} size={'lg'} />
          <ButtonBase
            onClick={() => {
              openNewTab(mallProductUrl);
            }}
          >
            <Typography level="title-lg" variant="plain" color="neutral">
              상품명 : {productTitle}
            </Typography>
          </ButtonBase>
          <Tabs sx={{ width: '90%' }}>
            <TabList disableUnderline>
              <Tab>
                <ListItemDecorator>
                  <RateReviewIcon />
                </ListItemDecorator>
                Keyword
              </Tab>
              <Tab>
                <ListItemDecorator>
                  <SearchIcon />
                </ListItemDecorator>
                Review
              </Tab>
            </TabList>
            <TabPanel value={0}>
              <KeywordTemplate />
            </TabPanel>
            <TabPanel value={1}>
              <ReviewTemplate />
            </TabPanel>
          </Tabs>
        </ModalDialog>
      </Sheet>
    </Modal>
  );
};

export default ShoppingModal;
