import React from 'react';

import {IconButton} from '@material-ui/core';
import {createStyles, makeStyles, Theme} from '@material-ui/core/styles';

import {BoxComponent} from '../../components-v2/atoms/Box';
import {SocialMedia} from '../../interfaces/social';
import {SocialDetail, useSocialMediaList} from './use-social-media-list.hook';

type SocialMediaListProps = {
  connected: Array<SocialMedia>;
  toggleVerify: (social: SocialDetail) => void;
  openSocialPage: () => void;
};

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {},
    list: {
      display: 'flex',
      flexWrap: 'wrap',
      '& * >': {
        marginRight: theme.spacing(1),
        marginBottom: theme.spacing(1),
      },
    },
    icon: {
      '& rect': {
        fill: theme.palette.text.secondary,
      },
      '&.MuiIconButton-colorPrimary': {
        '& rect': {
          fill: theme.palette.primary.main,
        },
      },
      '& .MuiIconButton-label': {
        width: 24,
        height: 24,
      },
    },
  }),
);

export const SocialMediaList: React.FC<SocialMediaListProps> = ({
  connected,
  toggleVerify,
  openSocialPage,
}) => {
  const styles = useStyles();

  const socials = useSocialMediaList(connected);

  const handleSocialClicked = (social: SocialDetail) => () => {
    if (social.connected) {
      toggleVerify(social);
    }
  };

  return (
    <BoxComponent title="Social Media" onClick={openSocialPage}>
      <div className={styles.list}>
        {socials.map(social => (
          <IconButton
            key={social.id}
            size="small"
            color={social.connected ? 'primary' : 'default'}
            onClick={handleSocialClicked(social)}
            className={styles.icon}>
            {social.icon}
          </IconButton>
        ))}
      </div>
    </BoxComponent>
  );
};
