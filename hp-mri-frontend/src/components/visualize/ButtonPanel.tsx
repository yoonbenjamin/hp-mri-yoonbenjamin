/**
 * @fileoverview ButtonPanel.tsx: Menu UI for HP-MRI Visualization.
 *
 * @version 2.0.3
 * @author Ben Yoon
 * @date 2025-05-09
 */

import React, { useState, useRef } from 'react';
import html2canvas from 'html2canvas';
import {
    Box,
    IconButton,
    Drawer,
    Slider,
    Typography,
    Select,
    MenuItem,
    Switch,
    FormControlLabel,
    Button,
    Divider,
    Tooltip,
    TextField,
    Tabs,
    Tab
} from '@mui/material';
import { CloudUpload, Save, Tune, AspectRatio } from '@mui/icons-material';

interface ButtonProps {
    className?: string;
    toggleHpMriData: any;
    onFileUpload: any;
    onThresholdChange: any;
    onAlphaChange: any;
    threshold: any;
    alpha: number;
    onMagnetTypeChange: any;
    mode: 'spectral' | 'imaging';
    colorScale: 'Hot' | 'Jet' | 'B&W';
    onColorScaleChange: (value: 'Hot' | 'Jet' | 'B&W') => void;
    scaleByIntensity: boolean;
    onToggleScaleByIntensity: () => void;
    openDrawer: boolean;
    selectedTool: string | null;
    onOpenDrawer: (tool: string) => void;
    onContrastChange: (value: number, contrast: number) => void;
    imageSlice: number;
    contrast: number;
    setContrast: (value: number) => void;
    gifStart: number;
    setGifStart: (value: number) => void;
    gifEnd: number;
    setGifEnd: (value: number) => void;
    gifFps: number;
    setGifFps: (value: number) => void;
    gifFilename: string;
    setGifFilename: (value: string) => void;
    setImageSlice: (value: number) => void;
    onExportGif: () => void;
}

const ButtonPanel: React.FC<ButtonProps> = ({
    className,
    toggleHpMriData,
    onFileUpload,
    onThresholdChange,
    onAlphaChange,
    threshold,
    alpha,
    onMagnetTypeChange,
    mode,
    colorScale,
    onColorScaleChange,
    scaleByIntensity,
    onToggleScaleByIntensity,
    openDrawer,
    selectedTool,
    onOpenDrawer,
    onContrastChange,
    imageSlice,
    contrast,
    setContrast,
    gifStart,
    setGifStart,
    gifEnd,
    setGifEnd,
    gifFps,
    setGifFps,
    gifFilename,
    setGifFilename,
    onExportGif,
}) => {
    const fileInputRef = useRef<HTMLInputElement | null>(null);
    const [screenshotTab, setScreenshotTab] = useState(0);
    const [filename, setFilename] = useState("screenshot.png");

    const handleSaveScreenshot = () => {
        const el = document.getElementById('visualization-root');
        if (el) {
            html2canvas(el).then(canvas => {
                const link = document.createElement('a');
                link.href = canvas.toDataURL('image/png');
                link.download = filename || 'screenshot.png';
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
            });
        }
    };

    const handleFileSelect = () => fileInputRef.current?.click();
    const handleFileChange = (event: { target: { files: any } }) => {
        const files = event.target.files;
        if (files) onFileUpload(files);
    };

    return (
        <Box
            className={className}
            sx={{
                width: 60,
                height: '100vh',
                backgroundColor: '#1e1e1e',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                paddingTop: 2,
                position: 'fixed',
                left: 0,
                top: 0,
                zIndex: 10,
            }}
        >
            <Box sx={{ width: 60, display: 'flex', flexDirection: 'column', alignItems: 'center', paddingY: 2 }}>
                <Tooltip title="Upload File" placement="right">
                    <IconButton sx={{ color: 'white' }} onClick={handleFileSelect}>
                        <CloudUpload />
                    </IconButton>
                </Tooltip>
                <input type="file" multiple style={{ display: 'none' }} onChange={handleFileChange} ref={fileInputRef} />

                <Tooltip title="Screenshot & Export" placement="right">
                    <IconButton sx={{ color: 'white' }} onClick={() => onOpenDrawer('export')}>
                        <Save />
                    </IconButton>
                </Tooltip>

                <Tooltip title="Image Adjustments" placement="right">
                    <IconButton sx={{ color: 'white' }} onClick={() => onOpenDrawer('image')}>
                        <AspectRatio />
                    </IconButton>
                </Tooltip>

                <Tooltip title="Settings" placement="right">
                    <IconButton sx={{ color: 'white' }} onClick={() => onOpenDrawer('settings')}>
                        <Tune />
                    </IconButton>
                </Tooltip>
            </Box>

            <Drawer
                anchor="left"
                open={openDrawer}
                onClose={() => onOpenDrawer('')}
                variant="persistent"
                hideBackdrop
                sx={{
                    '& .MuiDrawer-paper': {
                        width: 320,
                        padding: 3,
                        background: '#2b2b2b',
                        color: 'white',
                        borderRadius: '0px 10px 10px 0px',
                        marginLeft: '60px',
                        boxShadow: '4px 0px 8px rgba(0,0,0,0.3)',
                    },
                }}
                ModalProps={{
                    keepMounted: true,
                    BackdropProps: { style: { backgroundColor: 'transparent' } },
                }}
            >
                <IconButton
                    onClick={() => onOpenDrawer('')}
                    sx={{
                        position: 'absolute',
                        top: 8,
                        right: 8,
                        color: 'white',
                        width: 24,
                        height: 24,
                        fontSize: '16px',
                        padding: 0,
                        minWidth: 'unset',
                        border: '1px solid white',
                        borderRadius: '4px',
                        lineHeight: 1,
                    }}
                >
                    ✕
                </IconButton>

                {selectedTool === 'export' && (
                    <>
                        <Typography variant="h6" sx={{ color: 'white', mb: 2 }}>
                            Export Options
                        </Typography>

                        <Tabs
                            value={screenshotTab}
                            onChange={(_, newValue) => setScreenshotTab(newValue)}
                            textColor="inherit"
                            TabIndicatorProps={{ style: { backgroundColor: 'white' } }}
                            sx={{ mb: 2 }}
                        >
                            <Tab label="Image" sx={{ color: 'white', fontWeight: 'bold' }} />
                            <Tab label="GIF" sx={{ color: 'white', fontWeight: 'bold' }} />
                        </Tabs>

                        {screenshotTab === 0 && (
                            <>
                                <Typography
                                    align="left"
                                    sx={{ color: 'white', fontWeight: 'bold', mb: 1 }}
                                >
                                    File Name
                                </Typography>
                                <TextField
                                    fullWidth
                                    value={filename}
                                    onChange={(e) => setFilename(e.target.value)}
                                    variant="outlined"
                                    size="small"
                                    sx={{
                                        backgroundColor: 'white',
                                        color: 'black',
                                        fontWeight: 'bold',
                                        borderRadius: 1,
                                        input: {
                                            color: 'black',
                                            fontWeight: 'bold',
                                        },
                                        '& .MuiOutlinedInput-root': {
                                            '& fieldset': {
                                                borderColor: 'white',
                                            },
                                        },
                                    }}
                                />
                                <Button
                                    fullWidth
                                    variant="contained"
                                    onClick={handleSaveScreenshot}
                                    sx={{
                                        mt: 2,
                                        backgroundColor: '#000c3f',
                                        color: 'white',
                                        fontWeight: 'bold',
                                        '&.Mui-disabled': {
                                            backgroundColor: '#000c3f',
                                            color: 'white',
                                            opacity: 0.6,
                                        },
                                    }}
                                >
                                    Save Screenshot
                                </Button>
                            </>
                        )}

                        {screenshotTab === 1 && (
                            <>
                                <Typography
                                    align="left"
                                    sx={{ color: 'white', fontWeight: 'bold', mb: 1 }}
                                >
                                    GIF Filename
                                </Typography>
                                <TextField
                                    fullWidth
                                    value={gifFilename}
                                    onChange={(e) => setGifFilename(e.target.value)}
                                    variant="outlined"
                                    size="small"
                                    sx={{
                                        backgroundColor: 'white',
                                        color: 'black',
                                        fontWeight: 'bold',
                                        borderRadius: 1,
                                        input: {
                                            color: 'black',
                                            fontWeight: 'bold',
                                        },
                                        '& .MuiOutlinedInput-root': {
                                            '& fieldset': {
                                                borderColor: 'white',
                                            },
                                        },
                                    }}
                                />
                                <Typography
                                    align="left"
                                    sx={{ color: 'white', fontWeight: 'bold', mb: 1 }}
                                >
                                    Start Dataset
                                </Typography>
                                <TextField
                                    fullWidth
                                    type="number"
                                    value={gifStart}
                                    onChange={(e) => setGifStart(Number(e.target.value))}
                                    variant="outlined"
                                    size="small"
                                    sx={{
                                        backgroundColor: 'white',
                                        color: 'black',
                                        fontWeight: 'bold',
                                        borderRadius: 1,
                                        input: {
                                            color: 'black',
                                            fontWeight: 'bold',
                                        },
                                        '& .MuiOutlinedInput-root': {
                                            '& fieldset': {
                                                borderColor: 'white',
                                            },
                                        },
                                    }}
                                />
                                <Typography
                                    align="left"
                                    sx={{ color: 'white', fontWeight: 'bold', mb: 1 }}
                                >
                                    End Dataset
                                </Typography>
                                <TextField
                                    fullWidth
                                    type="number"
                                    value={gifEnd}
                                    onChange={(e) => setGifEnd(Number(e.target.value))}
                                    variant="outlined"
                                    size="small"
                                    sx={{
                                        backgroundColor: 'white',
                                        color: 'black',
                                        fontWeight: 'bold',
                                        borderRadius: 1,
                                        input: {
                                            color: 'black',
                                            fontWeight: 'bold',
                                        },
                                        '& .MuiOutlinedInput-root': {
                                            '& fieldset': {
                                                borderColor: 'white',
                                            },
                                        },
                                    }}
                                />
                                <Typography
                                    align="left"
                                    sx={{ color: 'white', fontWeight: 'bold', mb: 1 }}
                                >
                                    Frame Rate (FPS)
                                </Typography>
                                <TextField
                                    fullWidth
                                    type="number"
                                    value={gifFps}
                                    onChange={(e) => setGifFps(Number(e.target.value))}
                                    variant="outlined"
                                    size="small"
                                    sx={{
                                        backgroundColor: 'white',
                                        color: 'black',
                                        fontWeight: 'bold',
                                        borderRadius: 1,
                                        input: {
                                            color: 'black',
                                            fontWeight: 'bold',
                                        },
                                        '& .MuiOutlinedInput-root': {
                                            '& fieldset': {
                                                borderColor: 'white',
                                            },
                                        },
                                    }}
                                />
                                <Button
                                    fullWidth
                                    variant="contained"
                                    onClick={onExportGif}
                                    sx={{
                                        mt: 2,
                                        backgroundColor: '#000c3f',
                                        color: 'white',
                                        fontWeight: 'bold',
                                        '&.Mui-disabled': {
                                            backgroundColor: '#000c3f',
                                            color: 'white',
                                            opacity: 0.6,
                                        },
                                    }}
                                >
                                    Export GIF
                                </Button>
                            </>
                        )}
                    </>
                )}

                {selectedTool === 'image' && (
                    <>
                        <Typography variant="h6" sx={{ color: 'white', mb: 2 }}>
                            Image Adjustments
                        </Typography>

                        <Typography
                            variant="body1"
                            sx={{ color: 'white', fontWeight: 'bold', mb: 1 }}
                        >
                            Contrast
                        </Typography>
                        <Slider
                            value={contrast}
                            min={0.1}
                            max={3.0}
                            step={0.1}
                            onChange={(_e, val) => setContrast(val as number)}
                            onChangeCommitted={(_e, val) => onContrastChange(imageSlice, val as number)}
                            sx={{
                                color: 'white',
                                '& .MuiSlider-thumb': { backgroundColor: 'white' },
                                '& .MuiSlider-track': { backgroundColor: 'white' },
                                '& .MuiSlider-rail': { backgroundColor: '#555' },
                            }}
                        />

                        {mode === 'spectral' ? (
                            <>
                            </>
                        ) : (
                            <>
                                <Divider sx={{ my: 2, background: 'white' }} />

                                <Typography
                                    variant="body1"
                                    sx={{ color: 'white', fontWeight: 'bold', mb: 1 }}
                                >
                                    Alpha: {alpha.toFixed(2)}</Typography>
                                <Slider
                                    value={alpha}
                                    min={0.0}
                                    max={1.0}
                                    step={0.05}
                                    onChange={(_e, newValue) => onAlphaChange(newValue as number)}
                                    sx={{
                                        color: 'white',
                                        '& .MuiSlider-thumb': { backgroundColor: 'white' },
                                        '& .MuiSlider-track': { backgroundColor: 'white' },
                                        '& .MuiSlider-rail': { backgroundColor: '#555' },
                                    }}
                                />
                            </>
                        )}
                        {/* <Typography variant="h6" sx={{ color: 'white', mb: 2 }}>
                            Voxel Selection
                        </Typography>
                        <Button fullWidth variant="contained" color="primary" onClick={onToggleSelecting}>
                            {onSelecting ? 'Stop Selecting' : 'Get Voxels'}
                        </Button>
                        <Button fullWidth variant="outlined" color="secondary" onClick={onResetVoxels} sx={{ mt: 1 }}>
                            Reset
                        </Button>
                        <Box mt={2} sx={{ color: 'white', fontWeight: 'bold' }}>
                            <Typography
                                variant="body1"
                                sx={{ color: 'white', fontWeight: 'bold', mb: 1 }}
                            >
                                Select Group:</Typography>
                            <label>
                                <input type="radio" checked={selectedGroup === 'A'} onChange={() => onSetSelectedGroup('A')} />
                                Group A
                            </label>
                            <label>
                                <input type="radio" checked={selectedGroup === 'B'} onChange={() => onSetSelectedGroup('B')} />
                                Group B
                            </label>
                        </Box> */}
                    </>
                )}

                {selectedTool === 'settings' && (
                    <>
                        <Typography variant="h6" sx={{ color: 'white', mb: 2 }}>
                            Settings
                        </Typography>

                        <FormControlLabel
                            control={
                                <Switch
                                    onChange={toggleHpMriData}
                                    color="primary"
                                    sx={{
                                        '& .MuiSwitch-switchBase': {
                                            color: 'white',
                                        },
                                        '& .Mui-checked': {
                                            color: '#00c7be',
                                        },
                                        '& .Mui-checked + .MuiSwitch-track': {
                                            backgroundColor: '#00c7be',
                                        },
                                    }}
                                />
                            }
                            label="Show HP-MRI Data"
                            sx={{
                                color: 'white',
                                fontWeight: 'bold',
                                fontSize: '0.95rem',
                                '& .MuiFormControlLabel-label': {
                                    color: 'white',
                                    fontWeight: 'bold',
                                },
                            }}
                        />

                        <Divider sx={{ my: 2, background: 'white' }} />

                        <Typography
                            variant="body1"
                            sx={{ color: 'white', fontWeight: 'bold', mb: 1 }}
                        >
                            Threshold</Typography>
                        <Slider value={threshold} min={0} max={1} step={0.1} onChange={onThresholdChange} sx={{
                            color: 'white',
                            '& .MuiSlider-thumb': { backgroundColor: 'white' },
                            '& .MuiSlider-track': { backgroundColor: 'white' },
                            '& .MuiSlider-rail': { backgroundColor: '#555' },
                        }} />

                        {mode === 'spectral' ? (
                            <>
                            </>
                        ) : (
                            <>
                                <Divider sx={{ my: 2, background: 'white' }} />
                                <FormControlLabel
                                    control={
                                        <Switch
                                            checked={scaleByIntensity}
                                            onChange={onToggleScaleByIntensity}
                                            color="primary"
                                            sx={{
                                                '& .MuiSwitch-switchBase': {
                                                    color: 'white',
                                                },
                                                '& .Mui-checked': {
                                                    color: '#00c7be',
                                                },
                                                '& .Mui-checked + .MuiSwitch-track': {
                                                    backgroundColor: '#00c7be',
                                                },
                                            }}
                                        />
                                    }
                                    label="Scale by Intensity"
                                    sx={{
                                        color: 'white',
                                        fontWeight: 'bold',
                                        fontSize: '0.95rem',
                                        '& .MuiFormControlLabel-label': {
                                            color: 'white',
                                            fontWeight: 'bold',
                                        },
                                    }}
                                />
                                {/* <Typography
                                    variant="body1"
                                    sx={{ color: 'white', fontWeight: 'bold', mb: 1 }}
                                >
                                    Metabolite</Typography>
                                <Select
                                    value={metabolite}
                                    onChange={(e) => onMetaboliteChange(Number(e.target.value))} // cast string to number
                                    fullWidth
                                    size='small'
                                    sx={{
                                        mt: 1.5,
                                        mb: 2,
                                        fontSize: '0.85rem',
                                        color: 'white',
                                        '.MuiOutlinedInput-notchedOutline': {
                                            borderColor: 'white',
                                        },
                                        '& .MuiSvgIcon-root': {
                                            color: 'white',
                                        },
                                    }}
                                >
                                    <MenuItem value={0}>Lactate</MenuItem>
                                    <MenuItem value={1}>Pyruvate</MenuItem>
                                    <MenuItem value={2}>Threonine</MenuItem>
                                </Select> */}
                                <Typography
                                    variant="body1"
                                    sx={{ color: 'white', fontWeight: 'bold', mb: 1 }}
                                >
                                    Heatmap Color Scale</Typography>
                                <Select
                                    value={colorScale}
                                    onChange={(e) => onColorScaleChange(e.target.value as 'Hot' | 'Jet' | 'B&W')}
                                    fullWidth
                                    size='small'
                                    sx={{
                                        mt: 1.5,
                                        mb: 2,
                                        fontSize: '0.85rem',
                                        color: 'white',
                                        '.MuiOutlinedInput-notchedOutline': {
                                            borderColor: 'white',
                                        },
                                        '& .MuiSvgIcon-root': {
                                            color: 'white',
                                        },
                                    }}
                                >
                                    <MenuItem value="Hot">Hot</MenuItem>
                                    <MenuItem value="Jet">Jet</MenuItem>
                                    <MenuItem value="B&W">Black & White</MenuItem>
                                </Select>

                            </>
                        )}

                        <Divider sx={{ my: 2, background: 'white' }} />
                        <Typography variant="h6" color='white'>Magnet Type</Typography>
                        <Select defaultValue="HUPC" onChange={onMagnetTypeChange} size='small' sx={{
                            mt: 1.5,
                            mb: 2,
                            fontSize: '0.85rem',
                            color: 'white',
                            '.MuiOutlinedInput-notchedOutline': {
                                borderColor: 'white',
                            },
                            '& .MuiSvgIcon-root': {
                                color: 'white',
                            },
                        }}>
                            <MenuItem value="HUPC">HUPC</MenuItem>
                            <MenuItem value="Clinical">Clinical</MenuItem>
                            <MenuItem value="MR Solutions">MR Solutions</MenuItem>
                        </Select>
                    </>
                )}
            </Drawer>
        </Box>
    );
};

export default ButtonPanel;
