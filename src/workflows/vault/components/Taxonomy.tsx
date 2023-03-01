import React, {useEffect, useState} from 'react';
import Box from '@mui/material/Box';
import TaxonomyAccordion from './TaxonomyAccordion';
import {
    addCategory,
    addInput,
    addSubCategory,
    getInputs,
    getTaxonomy,
    removeInput,
    updateInput,
    updateTaxonomyName,
} from '../api';
import {
    IInputTypeAddReq,
    IInputTypeUpdateReq,
    ITaxonomyCache,
    IVaultDataInputType,
    IVaultInputFileType,
    IVaultInputKeyboardType,
    IVaultSubCategory,
    IVaultVaultTaxonomyNameUpdateReq,
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
import AlertDialog, {
    AlertDialogProps,
} from '../../../common/components/alert-dialog';
import _ from 'lodash';

const DEFAULTS = {
    type: '',
    fileType: 'NONE',
    inputName: '',
    helperText: '',
    maxLen: INPUT_MAX_LEN_DEFAULT,
    multiline: 0,
    keyboardType: 'DEFAULT',
    inputOptions: '',
    autoSuggest: 0,
    mandatory: 0,
};

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
    const [fetchingInputs, setFetchingInputs] = useState('');

    // input
    const [addInputKey, setAddInputKey] = useState('');
    const [addInputModalOpen, seteAddInputModalOpen] = useState(false);

    // name change
    const [nameChangeModalOpen, setNameChangeModalOpen] = useState(false);
    const [newName, setNewName] = useState('');
    const [nameChangeOld, setNameChangeOld] = useState('');
    const [nameChangeId, setNameChangeId] = useState('');
    const [nameChangeType, setNameChangeType] = useState('');
    const [nameChangeProgress, setNameChangeProgress] = useState(false);

    const [dialog, setDialog] =
        React.useState<Partial<AlertDialogProps> | null>(null);

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

    const [editInputId, setEditInputId] = useState('');
    const handleDeleteInput = (key: string) => {
        const [categoryId, subCategoryId, inputTypeId] = key.split(':');
        const doDeleteInput = async (inputTypeId: string) => {
            setProgress(true);
            try {
                const res = await removeInput({inputTypeId});
                if (res.data.message === 'ok') {
                    notify({message: 'Input removed', severity: 'success'});
                } else {
                    console.debug(res);
                    notify({message: 'Failed to remove', severity: 'error'});
                }
                setProgress(false);
                setDialog(null);
                const inputKey = `${categoryId}:${subCategoryId}`;
                setInputsData(prev => ({
                    ...prev,
                    [inputKey]: [
                        ...prev[inputKey].filter(
                            o => o.inputTypeId !== inputTypeId,
                        ),
                    ],
                }));
            } catch (e) {
                setProgress(false);
                console.debug('err', e);
                notify({
                    message: 'Failed to remove',
                    severity: 'error',
                });
            }
        };
        setDialog({
            title: 'Do you want to remove input?',
            status: 'warning',
            buttons: {
                agreeLabel: 'Yes, delete',
                onAgree: () => {
                    (async () => {
                        await doDeleteInput(inputTypeId);
                    })();
                },
                disagreeLabel: 'No, keep it',
                onDisagree: () => {
                    setDialog(null);
                },
                agreeIsDanger: true,
            },
        });
    };
    useEffect(() => {
        if (editInputId !== '') {
            const [categoryId, subCategoryId, inputTypeId] =
                editInputId.split(':');
            const key = `${categoryId}:${subCategoryId}`;
            const data = inputsData[key].find(
                o => o.inputTypeId === inputTypeId,
            )! as IVaultDataInputType;
            setType(data.type);
            setFileType(data.fileType);
            setInputName(data.inputName);
            setHelperText(data.helperText);
            setMaxLen(data.maxLen);
            setMultiline(data.multiline);
            setKeyboardType(data.keyboardType);
            setInputOptions(data.inputOptions.replaceAll('::', '\n'));
            setAutoSuggest(data.autoSuggest);
            setMandatory(data.mandatory);
            seteAddInputModalOpen(true);
        }
    }, [editInputId]);
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
                <Box>
                    {key in inputsData &&
                        inputsData[key].map(o => (
                            <Box
                                key={o.inputTypeId}
                                sx={{
                                    borderBottom: '1px solid #cdc',
                                    paddingBottom: '10px',
                                }}>
                                <Box>
                                    Type: {o.type}, fileType: {o.fileType}
                                </Box>
                                <Box>
                                    Input name: {o.inputName}, helperText:{' '}
                                    {o.helperText}
                                </Box>
                                <Box>
                                    Max length: {o.maxLen}, multiline:{' '}
                                    {o.multiline}
                                </Box>
                                <Box>
                                    Keyboard type: {o.keyboardType},
                                    inputOptions: {o.inputOptions}
                                </Box>
                                <Box>
                                    Autosuggest:{' '}
                                    {o.autoSuggest === 1 ? '✅' : '❌'},
                                    mandatory: {o.mandatory === 1 ? '✅' : '❌'}
                                </Box>
                                <Box sx={{mt: 2}}>
                                    <Button
                                        onClick={() => {
                                            const key = `${o.categoryId}:${o.subCategoryId}:${o.inputTypeId}`;
                                            setEditInputId(key);
                                        }}
                                        variant={'outlined'}>
                                        Edit
                                    </Button>
                                    <Button
                                        sx={{marginLeft: 2}}
                                        color={'secondary'}
                                        onClick={() => {
                                            const key = `${o.categoryId}:${o.subCategoryId}:${o.inputTypeId}`;
                                            handleDeleteInput(key);
                                        }}
                                        variant={'outlined'}>
                                        Delete
                                    </Button>
                                </Box>
                            </Box>
                        ))}
                </Box>
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
    const handleNameChange = (
        id: string,
        type: string,
        existingName: string,
    ) => {
        setNameChangeId(id);
        setNameChangeType(type);
        setNewName(existingName);
        setNameChangeOld(existingName);
    };
    const getSubCategoryAccordion = (categoryId: string) => {
        if (data === null) {
            return [];
        }
        return (
            <TaxonomyAccordion
                onPressChangeName={handleNameChange}
                items={_.orderBy(
                    data[categoryId].subCategories,
                    ['createdAt'],
                    ['desc'],
                )
                    .map(subcategory => ({
                        label: subcategory.subCategoryName,
                        content: showInputs(
                            categoryId,
                            subcategory.subCategoryId,
                        ),
                        id: subcategory.subCategoryId,
                        type: 'subCategory',
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
                            id: '',
                            type: 'subCategory',
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
                id: categoryId,
                type: 'category',
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
                picUrl: '',
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
            let catId = '';
            let subCatId = '';
            let inputTypeId = '';
            if (editInputId !== '') {
                [catId, subCatId, inputTypeId] = editInputId.split(':');
            } else {
                catId = addInputKey.split(':')[0];
                subCatId = addInputKey.split(':')[1];
            }
            const payload: IInputTypeAddReq | IInputTypeUpdateReq = {
                inputTypeId,
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
            const res = await (editInputId === '' ? addInput : updateInput)(
                payload,
            );
            console.log('res', res);
            if (res.data !== null) {
                notify({
                    message: 'Input added/updated',
                    severity: 'success',
                });
                // add to state
                const inputKey = `${catId}:${subCatId}`;
                setInputsData(prev => ({
                    ...prev,
                    [inputKey]: [
                        ...prev[inputKey].filter(
                            o => o.inputTypeId !== inputTypeId,
                        ),
                        res.data.inputType,
                    ],
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

    const resetNameChange = () => {
        setNewName('');
        setNameChangeId('');
        setNameChangeType('');
        setNameChangeModalOpen(false);
        setNameChangeOld('');
    };

    const handleModalClose = () => {
        setNewCategoryOpen(false);
        setNewSubCategoryOpen(false);
        seteAddInputModalOpen(false);
        setCatPic('');
        setCatName('');
        setSubCatName('');
        setCatIdForSubCat('');
        setAddInputKey('');
        setEditInputId('');
        resetNameChange();
        resetInputForm();
    };
    const canAddSubCategory = () => {
        return subCatName.length > 0;
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
    const [multiline, setMultiline] = useState<number>(0); // 0 | 1
    const [keyboardType, setKeyboardType] = useState('DEFAULT');
    const [inputOptions, setInputOptions] = useState('');
    const [autoSuggest, setAutoSuggest] = useState<number>(0); // 0 | 1
    const [mandatory, setMandatory] = useState<number>(0); // 0 | 1

    const resetInputForm = () => {
        setType(DEFAULTS.type);
        setFileType(DEFAULTS.fileType);
        setInputName(DEFAULTS.inputName);
        setHelperText(DEFAULTS.helperText);
        setMaxLen(INPUT_MAX_LEN_DEFAULT);
        setMultiline(DEFAULTS.multiline);
        setKeyboardType(DEFAULTS.keyboardType);
        setInputOptions(DEFAULTS.inputOptions);
        setAutoSuggest(DEFAULTS.autoSuggest);
        setMandatory(DEFAULTS.mandatory);
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
                                        checked={multiline === 1}
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
                                        checked={autoSuggest === 1}
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
                                        checked={mandatory === 1}
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
                        label={
                            (editInputId !== '' ? 'Update' : 'Add') + ' input'
                        }
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
                    <TaxonomyAccordion
                        onPressChangeName={handleNameChange}
                        items={getAccordionItems()}
                    />
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
    useEffect(() => {
        if (nameChangeId !== '' && nameChangeType !== '') {
            setNameChangeModalOpen(true);
            console.log('name modal to open');
        }
    }, [nameChangeId, nameChangeType]);
    const canChangeName = () => {
        return newName !== '';
    };
    const doNameChange = async () => {
        const payload = {
            id: nameChangeId,
            type: nameChangeType,
            newName: newName,
        } as IVaultVaultTaxonomyNameUpdateReq;
        console.log('nameChange payload', payload);
        try {
            setNameChangeProgress(true);
            const res = await updateTaxonomyName(payload);
            setNameChangeProgress(false);
            if (res.data === 'ok') {
                notify({
                    message: 'Name changed',
                    severity: 'success',
                });
                resetNameChange();
                await fetchData();
            } else {
                notify({
                    message: res.data,
                    severity: 'warning',
                });
            }
        } catch (e) {
            console.error(e);
            notify({
                message: 'Failed to update name',
                severity: 'warning',
            });
        }
    };
    const getNameChangeModalContent = () => {
        if (progress) {
            return <ProgressIndicator />;
        }
        return (
            <Box>
                <Box mt={2} mb={1.4}>
                    New name
                </Box>
                <Box mb={1.4}>
                    <CustomTextField
                        id={'newName'}
                        value={newName}
                        onChange={setNewName}
                        style={{width: '100%'}}
                    />
                </Box>
                <Box>
                    <Box mb={1}>
                        <s>{nameChangeOld}</s> <strong>{newName}</strong>
                    </Box>
                    <br />
                    <CustomButton
                        disabled={!canChangeName()}
                        label={'Update name'}
                        progress={nameChangeProgress}
                        onClick={doNameChange}
                    />
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
                open={nameChangeModalOpen}
                setOpen={setNameChangeModalOpen}
                title={'Change name'}
                dialogContent={getNameChangeModalContent()}
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
                title={editInputId !== '' ? 'Update input' : 'Add new input'}
                dialogContent={addInputModalContent()}
                onClose={handleModalClose}
            />
            {dialog && (
                <AlertDialog
                    progress={progress}
                    open={dialog.title ? dialog.title.length > 0 : false}
                    onClose={() => setDialog(null)}
                    title={dialog?.title || ''}
                    body={dialog.body || ''}
                    status={dialog.status || 'info'}
                    {...dialog}
                />
            )}
        </Box>
    );
}

export default Taxonomy;
