import React from 'react';
import Accordion from '@mui/material/Accordion';
import AccordionDetails from '@mui/material/AccordionDetails';
import AccordionSummary from '@mui/material/AccordionSummary';
import Typography from '@mui/material/Typography';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import {Box, Button} from '@mui/material';

function TaxonomyAccordion(props: {
    items: {
        label: string;
        content: React.ReactNode;
        id: string;
        type: string;
    }[];
    onPressChangeName: (id: string, type: string, existingName: string) => void;
}) {
    const [expanded, setExpanded] = React.useState<string | false>(false);

    const handleChange =
        (panel: string) =>
        (event: React.SyntheticEvent, isExpanded: boolean) => {
            setExpanded(isExpanded ? panel : false);
        };

    return (
        <div>
            {props.items.map((item, idx) =>
                item.label === 'addSubCategory' ? (
                    item.content
                ) : (
                    <Box display={'flex'} flexDirection={'row'}>
                        <Box display={'flex'} flex={0.8} width={'100%'}>
                            <Accordion
                                style={{width: '100%', marginBottom: 12}}
                                expanded={expanded === 'panel' + idx}
                                onChange={handleChange('panel' + idx)}>
                                <AccordionSummary
                                    expandIcon={<ExpandMoreIcon />}
                                    aria-controls={`panel${idx}bh-content`}
                                    id={`panel${idx}bh-header`}>
                                    <Typography
                                        sx={{width: '33%', flexShrink: 0}}>
                                        {item.label}
                                    </Typography>
                                </AccordionSummary>
                                <AccordionDetails>
                                    {item.content}
                                </AccordionDetails>
                            </Accordion>
                        </Box>
                        <Box display={'flex'} flex={0.2}>
                            <Button
                                onClick={() => {
                                    props.onPressChangeName(
                                        item.id,
                                        item.type,
                                        item.label,
                                    );
                                }}>
                                Change name
                            </Button>
                        </Box>
                    </Box>
                ),
            )}
        </div>
    );
}

export default TaxonomyAccordion;
