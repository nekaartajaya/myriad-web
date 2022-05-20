import {DotsVerticalIcon} from '@heroicons/react/solid';

import React from 'react';

import {useRouter} from 'next/router';

import {capitalize, Menu, MenuItem, Typography} from '@material-ui/core';
import CardHeader from '@material-ui/core/CardHeader';
import IconButton from '@material-ui/core/IconButton';
import SvgIcon from '@material-ui/core/SvgIcon';

import PostAvatarComponent from './avatar/post-avatar.component';
import {PostHeaderProps} from './postHeader.interface';
import {useStyles} from './postHeader.style';
import {PostSubHeader} from './subHeader/post-sub-header.component';

import useModalAddToPost from 'src/components/Expericence/ModalAddToPost/useModalAddToPost.hook';
import ShowIf from 'src/components/common/show-if.component';
import {SocialsEnum} from 'src/interfaces/social';
import i18n from 'src/locale';

export const HeaderComponent: React.FC<PostHeaderProps> = props => {
  const {
    user,
    post,
    owner,
    disableAction = false,
    onDelete,
    onOpenTipHistory,
    onReport,
    onVisibility,
    onImporters,
  } = props;

  const style = useStyles();
  const router = useRouter();
  const addPostToExperience = useModalAddToPost();

  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

  const handleOpenPostSetting = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClosePostSetting = () => {
    setAnchorEl(null);
  };

  const openContentProfileUrl = (): void => {
    const url = getPlataformProfileUrl();

    switch (post.platform) {
      case 'myriad':
        router.push(url);
        break;
      default:
        window.open(url, '_blank');
        break;
    }
  };

  const getPlataformProfileUrl = (): string => {
    let url = '';

    if (!post.user) return url;

    switch (post.platform) {
      case SocialsEnum.TWITTER:
        url = `https://twitter.com/${post.people?.username as string}`;
        break;
      case SocialsEnum.REDDIT:
        url = `https://reddit.com/user/${post.people?.username as string}`;
        break;
      case 'myriad':
        url = `/profile/${post.createdBy}`;
        break;
      default:
        url = post.url;
        break;
    }

    return url;
  };

  const handleDelete = () => {
    onDelete();
    handleClosePostSetting();
  };

  const handlePostVisibility = () => {
    handleClosePostSetting();
    onVisibility();
  };

  const handleReport = () => {
    onReport();
    handleClosePostSetting();
  };

  const handleImporter = () => {
    onImporters();
  };

  const handleOpenTipHistory = () => {
    onOpenTipHistory();
    handleClosePostSetting();
  };

  const handleOpenAddPostToExperience = () => {
    handleClosePostSetting();
    const propsAddToPost = {
      post: post,
    };
    addPostToExperience(propsAddToPost);
  };

  const openPost = () => {
    router.push(`/post/${post.id}`);

    handleClosePostSetting();
  };

  const openUserProfile = () => {
    if (post.user) {
      router.push(`/profile/${post.user.id}`);
    }

    handleClosePostSetting();
  };

  const openSourcePost = () => {
    window.open(post.url, '_blank');

    handleClosePostSetting();
  };

  const openSourceAccount = () => {
    if (post.people) {
      const url = getPlataformProfileUrl();

      window.open(url, '_blank');
    }

    handleClosePostSetting();
  };

  return (
    <>
      <CardHeader
        classes={{root: style.headerRoot}}
        className={style.header}
        disableTypography
        avatar={
          <PostAvatarComponent
            name={post.user?.name ?? 'Unknown Myrian'}
            origin={post.platform}
            avatar={
              post.platform === 'myriad'
                ? post.user?.profilePictureURL
                : post.people?.profilePictureURL
            }
            onClick={openContentProfileUrl}
          />
        }
        title={
          <Typography variant="h5" onClick={openContentProfileUrl} className={style.title}>
            {post.platform === 'myriad' ? post.user?.name : (post.people?.name as string)}
          </Typography>
        }
        subheader={
          <PostSubHeader
            postId={post.id}
            date={post.createdAt}
            importers={post.importers}
            platform={post.platform}
            url={post.url}
            totalImporters={post.totalImporter}
            onImporters={handleImporter}
          />
        }
        action={
          !disableAction ? (
            <IconButton
              aria-label="post-setting"
              onClick={handleOpenPostSetting}
              className={style.action}
              disableRipple={true}
              disableFocusRipple={true}
              disableTouchRipple>
              <SvgIcon component={DotsVerticalIcon} viewBox="0 0 20 20" className={style.icon} />
            </IconButton>
          ) : null
        }
      />

      <Menu
        id="post-setting"
        anchorEl={anchorEl}
        style={{width: 170}}
        classes={{paper: style.menu}}
        keepMounted
        open={Boolean(anchorEl)}
        onClose={handleClosePostSetting}>
        <MenuItem onClick={handleOpenTipHistory}>
          {i18n.t('Post_Detail.Post_Options.Tip_History')}
        </MenuItem>

        <ShowIf condition={!owner}>
          <MenuItem onClick={openPost}>{i18n.t('Post_Detail.Post_Options.View_Post')}</MenuItem>
        </ShowIf>

        <ShowIf condition={!owner && post.platform !== 'myriad'}>
          <MenuItem onClick={openSourcePost}>
            {i18n.t('Post_Detail.Post_Options.View_Source_Post')}
          </MenuItem>
          <MenuItem onClick={openUserProfile}>
            {i18n.t('Post_Detail.Post_Options.Visit_Myriad_Profile')}
          </MenuItem>
          <MenuItem onClick={openSourceAccount}>
            {i18n.t('Post_Detail.Post_Options.Visit_Post_Platform', {
              postPlatform: capitalize(post.platform),
            })}
          </MenuItem>
        </ShowIf>

        <ShowIf condition={!owner && post.platform === 'myriad'}>
          <MenuItem onClick={openUserProfile}>
            {i18n.t('Post_Detail.Post_Options.Visit_Profile')}
          </MenuItem>
        </ShowIf>

        <ShowIf condition={owner && !post.deletedAt}>
          <MenuItem onClick={handlePostVisibility}>
            {i18n.t('Post_Detail.Post_Options.Post_Visibility')}
          </MenuItem>
        </ShowIf>

        <ShowIf condition={!!user}>
          <MenuItem onClick={handleOpenAddPostToExperience}>
            {i18n.t('Post_Detail.Post_Options.Add_Post_To_Experience')}
          </MenuItem>
        </ShowIf>

        <ShowIf condition={!owner && !!user}>
          <MenuItem onClick={handleReport} className={style.danger}>
            {i18n.t('Post_Detail.Post_Options.Report')}
          </MenuItem>
        </ShowIf>

        <ShowIf condition={owner && !post.deletedAt}>
          <MenuItem onClick={handleDelete} className={style.danger} color="danger">
            {i18n.t('Post_Detail.Post_Options.Delete_Post')}
          </MenuItem>
        </ShowIf>
      </Menu>
    </>
  );
};
