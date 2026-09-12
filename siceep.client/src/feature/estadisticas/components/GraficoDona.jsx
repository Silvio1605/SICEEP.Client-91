import React from 'react';
import { Box, Stack, Typography } from '@mui/material';

const GraficoDona = ({ items = [], centerTexto = '', centerSub = '' }) => {
    const total = items.reduce((acc, i) => acc + (i.valor || 0), 0);
    const radio = 74;
    const grosor = 20;
    const c = 2 * Math.PI * radio;
    const gap = items.length > 1 ? 2.5 : 0;

    const segmentos = items.map((item, idx) => {
        const longitud = total > 0 ? (item.valor / total) * c : 0;
        const dash = longitud > gap ? Math.max(longitud - gap, 0.5) : 0;
        return {
            ...item,
            dash,
            offset: -items
                .slice(0, idx)
                .reduce((acc, it) => acc + (total > 0 ? (it.valor / total) * c : 0), 0),
        };
    });

    return (
        <Stack direction={{ xs: 'column', sm: 'row' }} alignItems="center" spacing={3} sx={{ width: '100%' }}>
            <Box sx={{ position: 'relative', width: 190, height: 190, flexShrink: 0 }}>
                <svg width={190} height={190} viewBox="0 0 190 190">
                    <circle cx={95} cy={95} r={radio} fill="none" stroke="#eef1f5" strokeWidth={grosor} />
                    <g transform="rotate(-90 95 95)">
                        {segmentos.map((s, idx) => (
                            <circle
                                key={idx}
                                cx={95}
                                cy={95}
                                r={radio}
                                fill="none"
                                stroke={s.color}
                                strokeWidth={grosor}
                                strokeDasharray={`${s.dash} ${c - s.dash}`}
                                strokeDashoffset={s.offset}
                            />
                        ))}
                    </g>
                </svg>
                <Box
                    sx={{
                        position: 'absolute',
                        inset: 0,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        textAlign: 'center'
                    }}
                >
                    <Typography variant="h5" sx={{ fontWeight: 800, lineHeight: 1.1 }}>
                        {centerTexto || total}
                    </Typography>
                    {centerSub && (
                        <Typography variant="caption" color="text.secondary" sx={{ lineHeight: 1.2 }}>
                            {centerSub}
                        </Typography>
                    )}
                </Box>
            </Box>

            <Stack spacing={0.75} sx={{ flex: 1, minWidth: 0, width: '100%' }}>
                {items.map((item, idx) => (
                    <Stack key={idx} direction="row" alignItems="center" spacing={1}>
                        <Box sx={{ width: 12, height: 12, borderRadius: 1, bgcolor: item.color, flexShrink: 0 }} />
                        <Typography variant="body2" sx={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                            {item.label}
                        </Typography>
                        <Typography variant="body2" color="text.secondary" sx={{ ml: 'auto', fontWeight: 600 }}>
                            {item.valor}
                        </Typography>
                        <Typography variant="body2" color="text.secondary" sx={{ width: 52, textAlign: 'right' }}>
                            {total > 0 ? ((item.valor / total) * 100).toFixed(1) : '0.0'}%
                        </Typography>
                    </Stack>
                ))}
            </Stack>
        </Stack>
    );
};

export default GraficoDona;