import { CreditCardOffOutlined } from '@mui/icons-material';
import { Card, CardContent, Grid, Typography } from '@mui/material';
import React, { FC } from 'react'


interface Props {
    children?: React.ReactNode | undefined;
    title: string | number;
    subtitle: string;
    icon: JSX.Element;
}

export const SummaryTile: FC<Props> = ({ children, title, subtitle, icon }) => {
    return (
        <Grid item xs={12} sm={4} md={3} >
            <Card sx={{ display: 'flex' }}>
                <CardContent sx={{ width: 50, display: 'flex', justifyContent: 'center', alignItems: 'center',  }}>
                    {icon}
                </CardContent>
                <CardContent sx={{ flex: '1 0 auto', display: 'flex', flexDirection: 'column'}}>
                    <Typography variant='h3'>{title}</Typography>
                    <Typography variant='caption'>{subtitle}</Typography>
                </CardContent>
            </Card>
        </Grid>
    )
}
