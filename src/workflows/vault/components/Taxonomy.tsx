import React, {useEffect, useState} from 'react';
import Box from '@mui/material/Box';
import TaxonomyAccordion from './TaxonomyAccordion';
import {
    addCategory,
    addInput,
    addSubCategory,
    getInputs,
    getTaxonomy,
} from '../api';
import {
    IInputTypeAddReq,
    ITaxonomyCache,
    IVaultDataInputType,
    IVaultInputFileType,
    IVaultInputKeyboardType,
    IVaultSubCategory,
} from 'models/vault';
import {notify, toCamelCase} from '../../../common/lib/utils';
import ProgressIndicator from '../../../common/components/ProgressIndicator';
import {
    Button,
    FormControl,
    FormControlLabel,
    FormGroup,
    InputLabel,
    MenuItem,
    Select,
    Switch,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import CustomDialog from '../../../common/components/CustomDialog';
import CustomTextField from '../../../common/components/CustomTextField';
import CustomButton from '../../../common/components/CustomButton';
import {INPUT_MAX_LEN_DEFAULT} from '../../../constants';
import {IVaultInputType} from 'models/vault-input-type';

function Taxonomy() {
    const [fetching, setFetching] = useState(true);
    const [data, setData] = useState<ITaxonomyCache | null>(null);
    const [inputsData, setInputsData] = useState<{
        [k: string]: IVaultDataInputType[];
    }>({});
    // Category
    const [newCategoryOpen, setNewCategoryOpen] = useState(false);
    const [catName, setCatName] = useState('');
    const [catPic, setCatPic] = useState('');
    const [progress, setProgress] = useState(false);
    const [catIdForSubCat, setCatIdForSubCat] = useState('');

    // Sub category
    const [newSubCategoryOpen, setNewSubCategoryOpen] = useState(false);
    const [subCatName, setSubCatName] = useState('');
    const [subCatPic, setSubCatPic] = useState('');
    const [fetchingInputs, setFetchingInputs] = useState('');

    // input
    const [addInputKey, setAddInputKey] = useState('');
    const [addInputModalOpen, seteAddInputModalOpen] = useState(false);

    useEffect(() => {
        if (addInputKey !== '') {
            seteAddInputModalOpen(true);
        } else {
            seteAddInputModalOpen(false);
        }
    }, [addInputKey]);

    const fetchData = async () => {
        setFetching(true);
        try {
            const res = await getTaxonomy();
            if (res.data !== null) {
                setData(res.data);
            }
            setFetching(false);
        } catch (e) {
            setFetching(false);
            notify({
                message: 'Failed to fetch taxonomy',
                severity: 'error',
            });
        }
    };
    const fetchInputs = async (catId: string, subCatId: string) => {
        const key = `${catId}:${subCatId}`;
        setFetchingInputs(key);
        try {
            const res = await getInputs({
                categoryId: catId,
                subCategoryId: subCatId,
            });
            console.log('inputs for', key, res.data);
            if (res.data !== null) {
                setInputsData(prev => ({
                    ...prev,
                    [key]: res.data,
                }));
            } else {
                notify({
                    message: 'Failed to fetch inputs',
                    severity: 'success',
                });
            }
            setFetchingInputs('');
        } catch (e) {
            notify({
                message: 'Failed to fetch inputs',
                severity: 'error',
            });
            setFetchingInputs('');
        }
    };
    useEffect(() => {
        fetchData().then(_ => {});
    }, []);

    const showInputs = (catId: string, subCatId: string) => {
        if (catId === '' || subCatId === '') {
            return <></>;
        }
        const key = `${catId}:${subCatId}`;
        if (!(key in inputsData)) {
            return (
                <Box mt={2}>
                    <Button
                        disabled={fetchingInputs !== ''}
                        variant={'outlined'}
                        onClick={() => {
                            fetchInputs(catId, subCatId).then(_ => {});
                        }}>
                        {fetchingInputs ? (
                            <ProgressIndicator />
                        ) : (
                            'Fetch inputs'
                        )}
                    </Button>
                </Box>
            );
        }
        return (
            <Box>
                <Box>Form data... Edit button</Box>
                <Box mt={2}>
                    <Button
                        disabled={fetchingInputs.length > 0}
                        variant={'outlined'}
                        startIcon={<AddIcon />}
                        onClick={() => {
                            setAddInputKey(key);
                        }}>
                        Add input
                    </Button>
                </Box>
            </Box>
        );
    };
    const getSubCategoryAccordion = (categoryId: string) => {
        if (data === null) {
            return [];
        }
        return (
            <TaxonomyAccordion
                items={data[categoryId].subCategories
                    .map(subcategory => ({
                        label: subcategory.subCategoryName,
                        content: showInputs(
                            categoryId,
                            subcategory.subCategoryId,
                        ),
                    }))
                    .concat([
                        {
                            label: 'addSubCategory',
                            content: (
                                <Box mt={2}>
                                    <Button
                                        variant={'outlined'}
                                        startIcon={<AddIcon />}
                                        onClick={() => {
                                            setCatIdForSubCat(categoryId);
                                        }}>
                                        New sub-category
                                    </Button>
                                </Box>
                            ),
                        },
                    ])}
            />
        );
    };
    const getAccordionItems = () => {
        if (data === null) {
            return [];
        }
        return Object.keys(data).map((categoryId, _) => {
            return {
                label: data[categoryId].categoryName,
                content: getSubCategoryAccordion(categoryId),
            };
        });
    };

    useEffect(() => {
        if (catIdForSubCat.length > 0) {
            setNewSubCategoryOpen(true);
        } else {
            setNewSubCategoryOpen(false);
        }
    }, [catIdForSubCat]);

    const handleAddSubCategory = async () => {
        setProgress(true);
        try {
            const subCatId = toCamelCase(subCatName);
            const payload = {
                categoryId: catIdForSubCat,
                subCategoryName: subCatName,
                picUrl: subCatPic,
                subCategoryDescription: '',
                subCategoryId: subCatId,
            };
            const res = await addSubCategory(payload);
            if (res.data.message === 'ok') {
                notify({
                    message: 'Sub-Category added',
                    severity: 'success',
                });
                // add to state
                setData(prev => ({
                    ...prev,
                    [catIdForSubCat]: {
                        ...prev![catIdForSubCat]!,
                        subCategories: [
                            ...prev![catIdForSubCat].subCategories,
                            {
                                ...payload,
                                currentActive: true,
                                createdAt: Date.now(),
                                id: 0,
                            },
                        ],
                    },
                }));
            } else {
                notify({
                    message: 'Failed to add sub-category',
                    severity: 'error',
                });
            }
            setProgress(false);
            handleModalClose();
        } catch (e) {
            notify({
                message: 'Failed to add sub-category',
                severity: 'error',
            });
            setProgress(false);
            handleModalClose();
        }
    };
    const handleAddCategory = async () => {
        setProgress(true);
        try {
            const catId = toCamelCase(catName);
            const cat = {
                categoryName: catName,
                picUrl: catPic,
                categoryDescription: '',
                categoryId: catId,
            };
            const res = await addCategory(cat);
            if (res.data.message === 'ok') {
                notify({
                    message: 'Category added',
                    severity: 'success',
                });
                // add to state
                setData(prev => ({
                    ...prev,
                    [catId]: {
                        ...cat,
                        currentActive: true,
                        createdAt: Date.now(),
                        id: 0,
                        subCategories: [],
                    },
                }));
            } else {
                notify({
                    message: 'Failed to add category',
                    severity: 'error',
                });
            }
            setProgress(false);
            handleModalClose();
        } catch (e) {
            notify({
                message: 'Failed to add category',
                severity: 'error',
            });
            setProgress(false);
            handleModalClose();
        }
    };

    const handleAddInput = async () => {
        setProgress(true);
        try {
            const catId = addInputKey.split(':')[0];
            const subCatId = addInputKey.split(':')[1];
            const payload: IInputTypeAddReq = {
                categoryId: catId,
                subCategoryId: subCatId,
                type: type as IVaultInputType,
                fileType: fileType as IVaultInputFileType,
                inputName,
                helperText,
                maxLen,
                multiline,
                keyboardType: keyboardType as IVaultInputKeyboardType,
                mandatory,
                autoSuggest,
                inputOptions:
                    inputOptions === ''
                        ? '[]'
                        : inputOptions
                              .split('\n')
                              .map(o => o.trim())
                              .join('::'),
            };
            const res = await addInput(payload);
            console.log('res', res);
            if (res.data !== null) {
                notify({
                    message: 'Input added',
                    severity: 'success',
                });
                // add to state
                setInputsData(prev => ({
                    ...prev,
                    [addInputKey]: [...prev[addInputKey], res.data],
                }));
            } else {
                notify({
                    message: 'Failed to add input',
                    severity: 'error',
                });
            }
            setProgress(false);
            handleModalClose();
        } catch (e) {
            console.debug('err', e);
            notify({
                message: 'Failed to add input',
                severity: 'error',
            });
            setProgress(false);
            handleModalClose();
        }
    };

    const handleModalClose = () => {
        setNewCategoryOpen(false);
        setNewSubCategoryOpen(false);
        seteAddInputModalOpen(false);
        setCatPic('');
        setCatName('');
        setSubCatName('');
        setSubCatPic('');
        setCatIdForSubCat('');
        setAddInputKey('');
        resetInputForm();
    };
    const canAddSubCategory = () => {
        return subCatName.length > 0 && subCatPic.startsWith('http');
    };
    const canAddCategory = () => {
        return (
            catName.length > 0 && catPic.length > 0 && catPic.startsWith('http')
        );
    };
    const canAddInput = () => {
        if (type === '') {
            return false;
        }
        if (inputName === '') {
            return false;
        }
        if (type === 'FILE' && fileType === '') {
            return false;
        }
        if (type === 'OPTIONS' && inputOptions === '') {
            return false;
        }
        return true;
    };
    const [type, setType] = useState('');
    const [fileType, setFileType] = useState('NONE');
    const [inputName, setInputName] = useState('');
    const [helperText, setHelperText] = useState('');
    const [maxLen, setMaxLen] = useState(36);
    const [multiline, setMultiline] = useState<0 | 1>(0);
    const [keyboardType, setKeyboardType] = useState('DEFAULT');
    const [inputOptions, setInputOptions] = useState('');
    const [autoSuggest, setAutoSuggest] = useState<0 | 1>(0);
    const [mandatory, setMandatory] = useState<0 | 1>(0);
    const resetInputForm = () => {
        setType('');
        setFileType('');
        setInputName('');
        setHelperText('');
        setMaxLen(INPUT_MAX_LEN_DEFAULT);
        setMultiline(0);
        setKeyboardType('DEFAULT');
        setInputOptions('');
        setAutoSuggest(0);
        setMandatory(0);
    };

    const addInputModalContent = () => {
        if (progress) {
            return <ProgressIndicator />;
        }
        return (
            <Box>
                <Box mt={2} mb={1.4}>
                    Type
                </Box>
                <Box mb={1.4}>
                    <FormControl fullWidth>
                        <Select
                            id={'typeSelect'}
                            value={type}
                            onChange={e => setType(e.target.value as string)}>
                            <MenuItem value={''} selected>
                                Choose type
                            </MenuItem>
                            <MenuItem value={'FILE'}>FILE</MenuItem>
                            <MenuItem value={'TEXT'}>TEXT</MenuItem>
                            <MenuItem value={'CHECKBOX'}>CHECKBOX</MenuItem>
                            {/*<MenuItem value={'OPTIONS'}>OPTIONS</MenuItem>*/}
                            <MenuItem value={'DATE'}>DATE</MenuItem>
                        </Select>
                    </FormControl>
                </Box>
                <Box mt={2} mb={1.4}>
                    File type
                </Box>
                <Box mb={1.4}>
                    <FormControl fullWidth>
                        <Select
                            id={'fileTypeSelect'}
                            disabled={type !== 'FILE'}
                            value={fileType}
                            onChange={e =>
                                setFileType(e.target.value as string)
                            }>
                            <MenuItem value={'NONE'} selected>
                                Choose file type
                            </MenuItem>
                            <MenuItem value={'IMAGE_OR_PDF'}>
                                IMAGE OR PDF
                            </MenuItem>
                            <MenuItem value={'PDF'}>PDF</MenuItem>
                            <MenuItem value={'IMAGE'}>IMAGE</MenuItem>
                            <MenuItem value={'VIDEO'}>VIDEO</MenuItem>
                            <MenuItem value={'AUDIO'}>AUDIO</MenuItem>
                            <MenuItem value={'TEXT'}>TEXT</MenuItem>
                        </Select>
                    </FormControl>
                </Box>
                <Box mt={2} mb={1.4}>
                    Input name
                </Box>
                <Box mb={1.4}>
                    <FormControl fullWidth>
                        <CustomTextField
                            id={'inputName'}
                            value={inputName}
                            onChange={setInputName}
                            style={{width: '100%'}}
                            inputProps={{
                                maxLength: 128,
                            }}
                        />
                    </FormControl>
                </Box>
                <Box mt={2} mb={1.4}>
                    Helper text
                </Box>
                <Box mb={1.4}>
                    <FormControl fullWidth>
                        <CustomTextField
                            id={'helperText'}
                            value={helperText}
                            onChange={setHelperText}
                            style={{width: '100%'}}
                            inputProps={{
                                maxLength: 256,
                            }}
                        />
                    </FormControl>
                </Box>
                <Box mt={2} mb={1.4}>
                    Max length
                </Box>
                <Box mb={1.4}>
                    <FormControl fullWidth>
                        <CustomTextField
                            id={'maxLen'}
                            value={maxLen.toString(10)}
                            onChange={e => setMaxLen(parseInt(e))}
                            style={{width: '100%'}}
                        />
                    </FormControl>
                </Box>
                <Box mb={1.4}>
                    <FormControl fullWidth>
                        <FormGroup>
                            <FormControlLabel
                                control={
                                    <Switch
                                        onChange={e =>
                                            setMultiline(
                                                e.target.checked ? 1 : 0,
                                            )
                                        }
                                    />
                                }
                                label="Multiline"
                            />
                        </FormGroup>
                    </FormControl>
                </Box>
                <Box mt={2} mb={1.4}>
                    Keyboard type
                </Box>
                <Box mb={1.4}>
                    <FormControl fullWidth>
                        <Select
                            id={'keyboardTypeSelect'}
                            value={keyboardType}
                            onChange={e =>
                                setKeyboardType(e.target.value as string)
                            }>
                            <MenuItem value={'DEFAULT'}>DEFAULT</MenuItem>
                            <MenuItem value={'NUM_PAD'}>NUM PAD</MenuItem>
                            <MenuItem value={'DECIMAL_PAD'}>
                                DECIMAL PAD
                            </MenuItem>
                            <MenuItem value={'NUMERIC'}>NUMERIC</MenuItem>
                            <MenuItem value={'EMAIL_ADDR'}>
                                EMAIL ADDRESS
                            </MenuItem>
                            <MenuItem value={'PHONE_PAD'}>PHONE PAD</MenuItem>
                            <MenuItem value={'URL'}>URL</MenuItem>
                        </Select>
                    </FormControl>
                </Box>
                {/*<Box mt={2} mb={1.4}>*/}
                {/*    Input options*/}
                {/*</Box>*/}
                {/*<Box mb={1.4}>*/}
                {/*    <CustomTextField*/}
                {/*        disabled={type !== 'OPTIONS'}*/}
                {/*        id={'inputOptions'}*/}
                {/*        value={inputOptions}*/}
                {/*        onChange={setInputOptions}*/}
                {/*        style={{width: '100%'}}*/}
                {/*        multiline={true}*/}
                {/*        rows={6}*/}
                {/*        helperText={'Enter each option in separate line'}*/}
                {/*    />*/}
                {/*</Box>*/}
                <Box mb={1.4}>
                    <FormControl fullWidth>
                        <FormGroup>
                            <FormControlLabel
                                control={
                                    <Switch
                                        onChange={e =>
                                            setAutoSuggest(
                                                e.target.checked ? 1 : 0,
                                            )
                                        }
                                    />
                                }
                                label="Autosuggest"
                            />
                        </FormGroup>
                    </FormControl>
                </Box>
                <Box mb={1.4}>
                    <FormControl fullWidth>
                        <FormGroup>
                            <FormControlLabel
                                control={
                                    <Switch
                                        onChange={e =>
                                            setMandatory(
                                                e.target.checked ? 1 : 0,
                                            )
                                        }
                                    />
                                }
                                label="Mandatory"
                            />
                        </FormGroup>
                    </FormControl>
                </Box>
                <Box>
                    <CustomButton
                        disabled={!canAddInput()}
                        label={'Add input'}
                        progress={progress}
                        onClick={handleAddInput}
                        style={{
                            width: '100%',
                        }}
                    />
                </Box>
            </Box>
        );
    };
    const getNewCategoryModalContent = () => {
        if (progress) {
            return <ProgressIndicator />;
        }
        return (
            <Box>
                <Box mt={2} mb={1.4}>
                    Category name
                </Box>
                <Box mb={1.4}>
                    <CustomTextField
                        id={'catName'}
                        value={catName}
                        onChange={setCatName}
                        style={{width: '100%'}}
                    />
                </Box>
                <Box mt={2} mb={1.4}>
                    Picture url
                </Box>
                <Box mb={1.4}>
                    <CustomTextField
                        id={'catPic'}
                        value={catPic}
                        onChange={setCatPic}
                        style={{width: '100%'}}
                    />
                </Box>
                <Box mb={1.4}>
                    <img src={catPic} style={{width: 240, height: 240}} />
                </Box>
                <Box>
                    <Box mb={1}>
                        Category id will be - {toCamelCase(catName)}
                    </Box>
                    <CustomButton
                        disabled={!canAddCategory()}
                        label={'Add category'}
                        progress={progress}
                        onClick={handleAddCategory}
                    />
                </Box>
            </Box>
        );
    };
    const getNewSubCategoryModalContent = () => {
        if (progress) {
            return <ProgressIndicator />;
        }
        if (catIdForSubCat === '' || data === null) {
            return <></>;
        }
        return (
            <Box>
                <Box mb={1.4}>
                    Adding under category:{' '}
                    <strong>{data[catIdForSubCat].categoryName}</strong>
                </Box>
                <Box mt={2} mb={1.4}>
                    Sub-category name
                </Box>
                <Box mb={1.4}>
                    <CustomTextField
                        id={'subCatName'}
                        value={subCatName}
                        onChange={setSubCatName}
                        style={{width: '100%'}}
                    />
                </Box>
                <Box mt={2} mb={1.4}>
                    Picture url
                </Box>
                <Box mb={1.4}>
                    <CustomTextField
                        id={'subCatPic'}
                        value={subCatPic}
                        onChange={setSubCatPic}
                        style={{width: '100%'}}
                    />
                </Box>
                <Box mb={1.4}>
                    <img src={subCatPic} style={{width: 240, height: 240}} />
                </Box>
                <Box>
                    <Box mb={1}>
                        Sub-Category id will be - {toCamelCase(subCatName)}
                    </Box>
                    <CustomButton
                        disabled={!canAddSubCategory()}
                        label={'Add sub-category'}
                        progress={progress}
                        onClick={handleAddSubCategory}
                    />
                </Box>
            </Box>
        );
    };
    const getCategoryAccordion = () => {
        return (
            <Box>
                <Box>
                    <TaxonomyAccordion items={getAccordionItems()} />
                </Box>
                <Box mt={2}>
                    <Button
                        variant={'outlined'}
                        startIcon={<AddIcon />}
                        onClick={() => {
                            setNewCategoryOpen(true);
                        }}>
                        New category
                    </Button>
                </Box>
            </Box>
        );
    };
    return (
        <Box>
            {fetching ? <ProgressIndicator /> : getCategoryAccordion()}
            <CustomDialog
                open={newCategoryOpen}
                setOpen={setNewCategoryOpen}
                title={'Add new category'}
                dialogContent={getNewCategoryModalContent()}
                onClose={handleModalClose}
            />
            <CustomDialog
                open={newSubCategoryOpen}
                setOpen={setNewSubCategoryOpen}
                title={'Add new sub-category'}
                dialogContent={getNewSubCategoryModalContent()}
                onClose={handleModalClose}
            />
            <CustomDialog
                open={addInputModalOpen}
                setOpen={seteAddInputModalOpen}
                title={'Add new input'}
                dialogContent={addInputModalContent()}
                onClose={handleModalClose}
            />
        </Box>
    );
}

export default Taxonomy;
