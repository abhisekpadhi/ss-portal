import React from 'react';
import { styled } from '@mui/material/styles';
import { Paper } from '@mui/material';

export const CardBgThemes = [
    `background-image: linear-gradient(to right top, #c3ffd0, #ceffcc, #d9ffca, #e4ffc8, #eeffc7, #f6fbca, #fcf8d0, #fff5d6, #fff3e4, #fff5f6, #fffaff, #ffffff);`,
    `background-image: linear-gradient(to right top, #e8ffb5, #d4ffc1, #c3ffce, #b4ffdc, #a9ffe9, #adfff2, #b2fff9, #bafeff, #cefdff, #e5fcff, #f7fcff, #ffffff);`,
    `background-image: linear-gradient(to right top, #c3f3ff, #bff8f9, #c2fcef, #ccfee2, #ddffd5, #ebfbd2, #f7f8d2, #fff5d6, #fff3e4, #fff5f6, #fffaff, #ffffff);`,
    `background-image: linear-gradient(to right top, #c3f3ff, #c2f3ef, #cbf1de, #dbedcf, #ece7c6, #f8e4cb, #fee3d4, #ffe3de, #ffe9ec, #fdf1f7, #fcf8fd, #ffffff);`,
    `background-image: linear-gradient(to right top, #c3d1ff, #e0cdf6, #f4cce8, #fecfda, #ffd4cf, #ffd9d4, #ffded9, #ffe3de, #ffe9ec, #fdf1f7, #fcf8fd, #ffffff);`,
    `background-image: linear-gradient(to right top, #c3d1ff, #abdeff, #99ebff, #99f4f5, #adfbe1, #b4fce7, #bcfeec, #c4fff1, #cfffff, #e4fdff, #f6fdff, #ffffff);`,
    `background-image: linear-gradient(to right top, #c3d1ff, #bbdbff, #b6e4ff, #b7ecff, #bcf3ff, #c5f6ff, #cff8ff, #d8fbff, #e4fbff, #f1fbff, #fafcff, #ffffff);`,
    `background-image: linear-gradient(to right top, #e9c3ff, #c6d4ff, #a5e4ff, #95f1ff, #9ff9f8, #acfbf9, #b9fdfa, #c5fffc, #d4feff, #e8fdff, #f8fdff, #ffffff);`,
    `background-image: linear-gradient(to right top, #e9c3ff, #ffc1e4, #ffc9c8, #ffd7b4, #ffe9b2, #e7f4c1, #d5fbd8, #cdffef, #d4ffff, #e6feff, #f7fdff, #ffffff);`,
    `background-image: linear-gradient(to right top, #ffc3ed, #ffc6d7, #ffcfc3, #ffddb8, #ffebb9, #ffeec2, #fff2cb, #fff5d4, #fff2e3, #fff5f6, #fffaff, #ffffff);`,
];

export const ThemedDownloadCertificateCard = styled(Paper)`
    background-image: linear-gradient(
        to right top,
        #c3ffd0,
        #ceffcc,
        #d9ffca,
        #e4ffc8,
        #eeffc7,
        #f6fbca,
        #fcf8d0,
        #fff5d6,
        #fff3e4,
        #fff5f6,
        #fffaff,
        #ffffff
    );
` as typeof Paper;

export const ThemedQuizzesForYouCard = styled(Paper)`
    background-image: linear-gradient(
        to right top,
        #c3d1ff,
        #abdeff,
        #99ebff,
        #99f4f5,
        #adfbe1,
        #b4fce7,
        #bcfeec,
        #c4fff1,
        #cfffff,
        #e4fdff,
        #f6fdff,
        #ffffff
    );
` as typeof Paper;
