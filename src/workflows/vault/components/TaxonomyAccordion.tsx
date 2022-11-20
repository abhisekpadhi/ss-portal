import React from 'react';
import Accordion from '@mui/material/Accordion';
import AccordionDetails from '@mui/material/AccordionDetails';
import AccordionSummary from '@mui/material/AccordionSummary';
import Typography from '@mui/material/Typography';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

function TaxonomyAccordion(props: {
    items: {label: string; content: React.ReactNode}[];
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
                    <Accordion
                        expanded={expanded === 'panel' + idx}
                        onChange={handleChange('panel' + idx)}>
                        <AccordionSummary
                            expandIcon={<ExpandMoreIcon />}
                            aria-controls={`panel${idx}bh-content`}
                            id={`panel${idx}bh-header`}>
                            <Typography sx={{width: '33%', flexShrink: 0}}>
                                {item.label}
                            </Typography>
                        </AccordionSummary>
                        <AccordionDetails>{item.content}</AccordionDetails>
                    </Accordion>
                ),
            )}
        </div>
    );
}

export default TaxonomyAccordion;
