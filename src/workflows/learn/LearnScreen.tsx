import React, {useEffect, useState} from 'react';
import Container from '@mui/material/Container';
import {notify} from '../../common/lib/utils';
import ArticlesTable from './components/ArticlesTable';
import Box from '@mui/material/Box';
import CustomButton from '../../common/components/CustomButton';
import CustomDialog from '../../common/components/CustomDialog';
import {BeatLoader} from 'react-spinners';
import {COLORS} from '../../constants';
import {IArticles} from 'models/articles';
import {
    addArticle,
    getPinnedArticles,
    getUnpinnedArticles,
    pinArticle,
    removeArticle,
    republishArticle,
    unpinArticle,
    updateArticle,
} from './api';
import CustomTextField from '../../common/components/CustomTextField';
import {Button, Divider} from '@mui/material';
import PushPinIcon from '@mui/icons-material/PushPin';
import AutorenewIcon from '@mui/icons-material/Autorenew';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import AddIcon from '@mui/icons-material/Add';

function LearnScreen() {
    // pinned
    const [fetchingPinned, setFetchingPinned] = useState(false);
    const [fetchingMorePinned, setFetchingMorePinned] = useState(false);
    const [offsetPinned, setOffsetPinned] = useState(0);
    const [dataPinned, setDataPinned] = useState<IArticles[]>([]);
    const [hasMorePinned, setHasMorePinned] = useState(true);

    // unpinned
    const [fetchingUnPinned, setFetchingUnPinned] = useState(false);
    const [fetchingMoreUnPinned, setFetchingMoreUnPinned] = useState(false);
    const [offsetUnPinned, setOffsetUnPinned] = useState(0);
    const [dataUnPinned, setDataUnPinned] = useState<IArticles[]>([]);
    const [hasMoreUnpinned, setHasMoreUnpinned] = useState(true);
    const limit = 100;

    const fetchPinned = async () => {
        if (!hasMorePinned) {
            notify({
                message: "That's all, no more data.",
                severity: 'warn',
            });
            return;
        }

        try {
            offsetPinned === 0
                ? setFetchingPinned(true)
                : setFetchingMorePinned(true);
            const res = await getPinnedArticles({offset: offsetPinned, limit});
            if (res.data.articles !== null) {
                setDataPinned(res.data.articles);
                setOffsetPinned(res.data.offset);
                setHasMorePinned(res.data.articles.length === limit);
            } else {
                notify({
                    message: 'Failed to fetch data',
                    severity: 'error',
                });
            }
            offsetPinned === 0
                ? setFetchingPinned(false)
                : setFetchingMorePinned(false);
        } catch (e) {
            notify({
                message: 'Failed to fetch data',
                severity: 'error',
            });
            offsetPinned === 0
                ? setFetchingPinned(false)
                : setFetchingMorePinned(false);
            console.debug(e);
        }
    };

    const fetchUnPinned = async () => {
        if (!hasMoreUnpinned) {
            notify({
                message: "That's all, no more data.",
                severity: 'warn',
            });
            return;
        }

        try {
            offsetUnPinned === 0
                ? setFetchingUnPinned(true)
                : setFetchingMoreUnPinned(true);
            const res = await getUnpinnedArticles({
                offset: offsetPinned,
                limit,
            });
            if (res.data.articles !== null) {
                setDataUnPinned(res.data.articles);
                setOffsetUnPinned(res.data.offset);
                setHasMoreUnpinned(res.data.articles.length === limit);
            } else {
                notify({
                    message: 'Failed to fetch data',
                    severity: 'error',
                });
            }
            offsetPinned === 0
                ? setFetchingUnPinned(false)
                : setFetchingMoreUnPinned(false);
        } catch (e) {
            notify({
                message: 'Failed to fetch data',
                severity: 'error',
            });
            offsetPinned === 0
                ? setFetchingUnPinned(false)
                : setFetchingMoreUnPinned(false);
            console.debug(e);
        }
    };

    const fetchData = () => {
        fetchPinned().then(_ => {});
        fetchUnPinned().then(_ => {});
    };

    useEffect(() => {
        fetchData();
    }, []);

    const [progress, setProgress] = useState(false);
    const [title, setTitle] = useState('');
    const [picUrl, setPicUrl] = useState('');
    const [link, setLink] = useState('');
    const [articleId, setArticleId] = useState('');
    const [action, setAction] = useState<
        '' | 'update' | 'add' | 'remove' | 'pin' | 'unpin' | 'republish'
    >('');
    const [open, setOpen] = useState(false);
    useEffect(() => {
        if ((action !== '' && articleId !== '') || action === 'add') {
            switch (action) {
                case 'add':
                    handleAdd().then(_ => {});
                    break;
                case 'pin':
                    handlePin().then(_ => {});
                    break;
                case 'remove':
                    handleRemove().then(_ => {});
                    break;
                case 'republish':
                    handleRepublish().then(_ => {});
                    break;
                case 'unpin':
                    handleUnpin().then(_ => {});
                    break;
                case 'update':
                    handleUpdate().then(_ => {});
                    break;
                default:
                    break;
            }
        }
    }, [action, articleId]);
    useEffect(() => {
        if (articleId !== '') {
            const article =
                dataPinned.find(o => o.articleId === articleId) ??
                dataUnPinned.find(o => o.articleId === articleId) ??
                null;
            const title = article?.title ?? '';
            const pic = article?.picUrl ?? '';
            const link = article?.link ?? '';
            setTitle(title);
            setPicUrl(pic);
            setLink(link);
            setOpen(true);
        }
    }, [articleId]);
    const resetData = () => {
        setTitle('');
        setArticleId('');
        setPicUrl('');
        setLink('');
    };
    const handleModalClose = () => {
        setOpen(false);
        setOpenNew(false);
        resetData();
    };
    const handleAdd = async () => {
        setProgress(true);
        try {
            const res = await addArticle({
                title,
                picUrl,
                link,
                pinned: 0,
                topicId: '',
                excerpt: '',
            });
            if (res.data.article) {
                notify({
                    message: 'Added article',
                    severity: 'success',
                });
            } else {
                notify({
                    message: 'Failed to add article.',
                    severity: 'error',
                });
            }
            setProgress(false);
            handleModalClose();
            fetchData();
        } catch (e) {
            setProgress(false);
            notify({
                message: 'Failed to add article. Error: ' + 'server error',
                severity: 'error',
            });
        }
    };
    const handleRemove = async () => {
        setProgress(true);
        try {
            const res = await removeArticle({articleId});
            if (res.data.message === 'ok') {
                notify({
                    message: 'Removed article',
                    severity: 'success',
                });
            } else {
                notify({
                    message: 'Failed to remove. Error: ' + res.data.message,
                    severity: 'error',
                });
            }
            setProgress(false);
            handleModalClose();
            fetchData();
        } catch (e) {
            setProgress(false);
            notify({
                message: 'Failed to remove. Error: ' + 'server error',
                severity: 'error',
            });
        }
    };
    const handlePin = async () => {
        setProgress(true);
        try {
            const res = await pinArticle({articleId});
            if (res.data.message === 'ok') {
                notify({
                    message: 'Pinned article',
                    severity: 'success',
                });
            } else {
                notify({
                    message: 'Failed to pin. Error: ' + res.data.message,
                    severity: 'error',
                });
            }
            setProgress(false);
            handleModalClose();
            fetchData();
        } catch (e) {
            setProgress(false);
            notify({
                message: 'Failed to pin. Error: ' + 'server error',
                severity: 'error',
            });
        }
    };
    const handleUnpin = async () => {
        setProgress(true);
        try {
            const res = await unpinArticle({articleId});
            if (res.data.message === 'ok') {
                notify({
                    message: 'Unpinned article',
                    severity: 'success',
                });
            } else {
                notify({
                    message: 'Failed to unpin. Error: ' + res.data.message,
                    severity: 'error',
                });
            }
            setProgress(false);
            handleModalClose();
            fetchData();
        } catch (e) {
            setProgress(false);
            notify({
                message: 'Failed to unpin. Error: ' + 'server error',
                severity: 'error',
            });
        }
    };
    const handleRepublish = async () => {
        setProgress(true);
        try {
            const res = await republishArticle({articleId});
            if (res.data.message === 'ok') {
                notify({
                    message: 'Republished article',
                    severity: 'success',
                });
            } else {
                notify({
                    message: 'Failed to republish. Error: ' + res.data.message,
                    severity: 'error',
                });
            }
            setProgress(false);
            handleModalClose();
            fetchData();
        } catch (e) {
            setProgress(false);
            notify({
                message: 'Failed to republish. Error: ' + 'server error',
                severity: 'error',
            });
        }
    };
    const handleUpdate = async () => {
        setProgress(true);
        try {
            const res = await updateArticle({
                articleId,
                title,
                picUrl,
                link,
                pinned:
                    dataPinned.findIndex(o => o.articleId === articleId) !== -1
                        ? 1
                        : 0,
                topicId: '',
                excerpt: '',
            });
            if (res.data.message === 'ok') {
                notify({
                    message: 'Updated article',
                    severity: 'success',
                });
            } else {
                notify({
                    message: 'Failed to update. Error: ' + res.data.message,
                    severity: 'error',
                });
            }
            setProgress(false);
            handleModalClose();
            fetchData();
        } catch (e) {
            setProgress(false);
            notify({
                message: 'Failed to update. Error: ' + 'server error',
                severity: 'error',
            });
        }
    };
    const getDialogContent = () => {
        return (
            <Box>
                {progress ? (
                    <BeatLoader size={12} color={COLORS.theme} />
                ) : (
                    <Box>
                        <Box mb={2}>
                            <Button
                                onClick={() => {
                                    const pinned =
                                        dataPinned.findIndex(
                                            o => o.articleId === articleId,
                                        ) !== -1;
                                    pinned
                                        ? setAction('unpin')
                                        : setAction('pin');
                                }}
                                startIcon={<PushPinIcon />}
                                variant={'outlined'}
                                sx={{marginRight: 2}}
                                color={
                                    dataPinned.findIndex(
                                        o => o.articleId === articleId,
                                    ) !== -1
                                        ? 'secondary'
                                        : 'primary'
                                }>
                                {dataPinned.findIndex(
                                    o => o.articleId === articleId,
                                ) !== -1
                                    ? 'Un-pin'
                                    : 'Pin'}
                            </Button>
                            <Button
                                onClick={() => {
                                    setAction('republish');
                                }}
                                startIcon={<AutorenewIcon />}
                                variant={'outlined'}
                                sx={{marginRight: 2}}>
                                Republish
                            </Button>
                            <Button
                                onClick={() => {
                                    setAction('remove');
                                }}
                                startIcon={<DeleteForeverIcon />}
                                variant={'outlined'}
                                color={'secondary'}>
                                Remove
                            </Button>
                        </Box>
                        <Divider />
                        <Box mt={2}>
                            <Box mb={1.2}>Title</Box>
                            <Box>
                                <CustomTextField
                                    id={'titleInput'}
                                    label={'Title'}
                                    value={title}
                                    onChange={text => setTitle(text)}
                                    helperText={
                                        'Title must be longer than 3 letters'
                                    }
                                    style={{
                                        width: '100%',
                                    }}
                                    inputProps={{
                                        minLength: 3,
                                    }}
                                />
                            </Box>

                            <Box mb={1.2}>Link</Box>
                            <Box>
                                <CustomTextField
                                    id={'linkInput'}
                                    value={link}
                                    onChange={text => setLink(text)}
                                    style={{
                                        width: '100%',
                                    }}
                                    inputProps={{
                                        minLength: 7,
                                    }}
                                />
                            </Box>

                            <Box mt={1.2} mb={1.2}>
                                Picture url
                            </Box>

                            <Box>
                                <CustomTextField
                                    id={'picUrlInput'}
                                    value={picUrl}
                                    onChange={text => setPicUrl(text)}
                                    style={{
                                        width: '100%',
                                    }}
                                    inputProps={{
                                        minLength: 7,
                                    }}
                                />
                                <Box mr={2} mt={1.4}>
                                    <img
                                        src={picUrl}
                                        style={{
                                            width: 320,
                                            height: 320,
                                            borderRadius: 12,
                                        }}
                                    />
                                </Box>
                            </Box>
                        </Box>
                        <Box mt={2}>
                            <CustomButton
                                label={'Update post'}
                                progress={progress}
                                onClick={() => {
                                    setAction('update');
                                }}
                            />
                        </Box>
                    </Box>
                )}
            </Box>
        );
    };
    const getNewArticleContent = () => {
        return (
            <Box>
                {progress ? (
                    <BeatLoader size={12} color={COLORS.theme} />
                ) : (
                    <Box>
                        <Box mt={2}>
                            <Box mb={1.2}>Title</Box>
                            <Box>
                                <CustomTextField
                                    id={'titleInput'}
                                    value={title}
                                    onChange={text => setTitle(text)}
                                    helperText={
                                        'Title must be longer than 3 letters'
                                    }
                                    style={{
                                        width: '100%',
                                    }}
                                    inputProps={{
                                        minLength: 3,
                                    }}
                                />
                            </Box>

                            <Box mb={1.2}>Link</Box>
                            <Box>
                                <CustomTextField
                                    id={'linkInput'}
                                    value={link}
                                    onChange={text => setLink(text)}
                                    style={{
                                        width: '100%',
                                    }}
                                    inputProps={{
                                        minLength: 7,
                                    }}
                                />
                            </Box>

                            <Box mt={1.2} mb={1.2}>
                                Picture url
                            </Box>

                            <Box>
                                <CustomTextField
                                    id={'picUrlInput'}
                                    value={picUrl}
                                    onChange={text => setPicUrl(text)}
                                    style={{
                                        width: '100%',
                                    }}
                                    inputProps={{
                                        minLength: 7,
                                    }}
                                />
                                <Box mr={2} mt={1.4}>
                                    <img
                                        src={picUrl}
                                        style={{
                                            width: 320,
                                            height: 320,
                                            borderRadius: 12,
                                        }}
                                    />
                                </Box>
                            </Box>
                        </Box>
                        <Box mt={2}>
                            <CustomButton
                                label={'Add article'}
                                progress={progress}
                                onClick={() => {
                                    setAction('add');
                                }}
                            />
                        </Box>
                    </Box>
                )}
            </Box>
        );
    };
    const [openNew, setOpenNew] = useState(false);

    return (
        <Container>
            <Box textAlign={'right'} mb={2}>
                <Button
                    variant={'contained'}
                    color={'primary'}
                    size={'large'}
                    onClick={() => {
                        setOpenNew(true);
                    }}
                    startIcon={<AddIcon />}
                    sx={{textTransform: 'none'}}>
                    New article
                </Button>
            </Box>
            <Box>
                <Box sx={{fontSize: '1.4rem'}}>Pinned articles</Box>
                <Box>
                    <ArticlesTable
                        rows={dataPinned}
                        onPressAction={(requestId: string) => {
                            setArticleId(requestId);
                        }}
                    />
                </Box>
            </Box>
            <Box mt={3} textAlign={'center'}>
                <CustomButton
                    disabled={!hasMorePinned}
                    label={'Load more'}
                    progress={
                        offsetPinned === 0 ? fetchingPinned : fetchingMorePinned
                    }
                    onClick={() => {
                        fetchPinned().then(_ => {});
                    }}
                />
            </Box>
            <Box mt={3}>
                <Box sx={{fontSize: '1.4rem'}}>Other articles</Box>
                <Box>
                    <ArticlesTable
                        rows={dataUnPinned}
                        onPressAction={(requestId: string) => {
                            setArticleId(requestId);
                        }}
                    />
                </Box>
            </Box>
            <Box mt={3} textAlign={'center'}>
                <CustomButton
                    disabled={!hasMoreUnpinned}
                    label={'Load more'}
                    progress={
                        offsetUnPinned === 0
                            ? fetchingUnPinned
                            : fetchingMoreUnPinned
                    }
                    onClick={() => {
                        fetchUnPinned().then(_ => {});
                    }}
                />
            </Box>
            <Box>
                <CustomDialog
                    open={open}
                    setOpen={setOpen}
                    title={'Article actions'}
                    dialogContent={getDialogContent()}
                    onClose={handleModalClose}
                />
                <CustomDialog
                    open={openNew}
                    setOpen={setOpenNew}
                    title={'New article'}
                    dialogContent={getNewArticleContent()}
                    onClose={handleModalClose}
                />
            </Box>
        </Container>
    );
}

export default LearnScreen;
