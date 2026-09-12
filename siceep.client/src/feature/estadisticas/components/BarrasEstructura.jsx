import React from 'react';
import { Box, Stack, Typography } from '@mui/material';

const colorM = '#1976d2';
const colorF = '#d81b60';

const BarrasEstructura = ({ items = [] }) => {
    const max = Math.max(...items.map((i) => i.total), 1);

    return (
        <Stack spacing={1}>
            {items.map((item, idx) => {
                const anchoM = item.total > 0 ? (item.masculinos / item.total) * 100 : 0;
                const anchoF = item.total > 0 ? (item.femeninos / item.total) * 100 : 0;

                return (
                    <Box key={idx}>
                        <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 0.5 }}>
                            <Typography
                                variant="body2"
                                sx={{ width: '38%', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}
                                title={item.estructura}
                            >
                                {item.estructura}
                            </Typography>
                            <Box
                                sx={{
                                    flex: 1,
                                    height: 22,
                                    borderRadius: 1.5,
                                    overflow: 'hidden',
                                    display: 'flex',
                                    bgcolor: '#f0f2f5'
                                }}
                            >
                                <Box
                                    sx={{
                                        width: `${(item.total / max) * 100}%`,
                                        display: 'flex',
                                        minWidth: item.total > 0 ? 6 : 0
                                    }}
                                >
                                    <Box sx={{ width: `${anchoM}%`, bgcolor: colorM }} />
                                    <Box sx={{ width: `${anchoF}%`, bgcolor: colorF }} />
                                </Box>
                            </Box>
                            <Stack direction="row" spacing={1.5} sx={{ width: 84, justifyContent: 'flex-end' }}>
                                <Typography variant="caption" sx={{ color: colorM, fontWeight: 700 }}>{item.masculinos}M</Typography>
                                <Typography variant="caption" sx={{ color: colorF, fontWeight: 700 }}>{item.femeninos}F</Typography>
                            </Stack>
                        </Stack>
                    </Box>
                );
            })}
        </Stack>
    );
};

export default BarrasEstructura;