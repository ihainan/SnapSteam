"use strict";
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
var react_1 = require("react");
var material_1 = require("@mui/material");
var CloudUpload_1 = require("@mui/icons-material/CloudUpload");
var Delete_1 = require("@mui/icons-material/Delete");
var LanguageContext_1 = require("../contexts/LanguageContext");
var locales_1 = require("../locales");
var DropZone = (0, material_1.styled)(material_1.Box)(function (_a) {
    var isDragActive = _a.isDragActive, theme = _a.theme;
    return ({
        border: "2px dashed ".concat(isDragActive ? theme.palette.primary.main : theme.palette.divider),
        borderRadius: '12px',
        padding: '40px 20px',
        textAlign: 'center',
        backgroundColor: isDragActive
            ? theme.palette.mode === 'dark'
                ? 'rgba(96, 165, 250, 0.08)'
                : 'rgba(59, 130, 246, 0.08)'
            : theme.palette.mode === 'dark'
                ? 'rgba(255, 255, 255, 0.05)'
                : '#f8f9fa',
        cursor: 'pointer',
        transition: 'all 0.2s ease',
        '&:hover': {
            backgroundColor: theme.palette.mode === 'dark'
                ? 'rgba(96, 165, 250, 0.08)'
                : 'rgba(59, 130, 246, 0.08)',
            borderColor: theme.palette.primary.main,
        },
    });
});
var PreviewGrid = (0, material_1.styled)(material_1.Box)({
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))',
    gap: '16px',
    marginTop: '20px',
});
var PreviewCard = (0, material_1.styled)(material_1.Box)(function (_a) {
    var theme = _a.theme;
    return ({
        position: 'relative',
        aspectRatio: '16/9',
        borderRadius: '8px',
        overflow: 'hidden',
        boxShadow: theme.palette.mode === 'dark' ? '0 1px 3px rgba(0,0,0,0.2)' : '0 1px 3px rgba(0,0,0,0.1)',
        '&:hover .delete-button': {
            opacity: 1,
        },
    });
});
var PreviewImage = (0, material_1.styled)('img')({
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    transition: 'all 0.2s ease',
});
var DeleteButton = (0, material_1.styled)(material_1.IconButton)(function (_a) {
    var theme = _a.theme;
    return ({
        position: 'absolute',
        top: '4px',
        right: '4px',
        backgroundColor: theme.palette.mode === 'dark' ? 'rgba(0, 0, 0, 0.6)' : 'rgba(0, 0, 0, 0.5)',
        color: '#ffffff',
        padding: '4px',
        opacity: 0,
        transition: 'all 0.2s ease',
        '&:hover': {
            backgroundColor: theme.palette.mode === 'dark' ? 'rgba(0, 0, 0, 0.8)' : 'rgba(0, 0, 0, 0.7)',
        },
        '& .MuiSvgIcon-root': {
            fontSize: '20px',
        },
    });
});
var UploadDialog = function (_a) {
    var open = _a.open, onClose = _a.onClose, onUpload = _a.onUpload;
    var language = (0, LanguageContext_1.useLanguage)().language;
    var _b = (0, react_1.useState)([]), selectedFiles = _b[0], setSelectedFiles = _b[1];
    var _c = (0, react_1.useState)(false), isDragActive = _c[0], setIsDragActive = _c[1];
    var t = locales_1.translations[language];
    var handleDrop = (0, react_1.useCallback)(function (e) {
        e.preventDefault();
        setIsDragActive(false);
        var files = Array.from(e.dataTransfer.files).filter(function (file) { return file.type.startsWith('image/'); });
        setSelectedFiles(function (prev) { return __spreadArray(__spreadArray([], prev, true), files, true); });
    }, []);
    var handleDragOver = (0, react_1.useCallback)(function (e) {
        e.preventDefault();
        setIsDragActive(true);
    }, []);
    var handleDragLeave = (0, react_1.useCallback)(function (e) {
        e.preventDefault();
        setIsDragActive(false);
    }, []);
    var handleFileSelect = function (e) {
        if (e.target.files) {
            var files_1 = Array.from(e.target.files);
            setSelectedFiles(function (prev) { return __spreadArray(__spreadArray([], prev, true), files_1, true); });
        }
    };
    var handleDelete = function (index) {
        setSelectedFiles(function (prev) { return prev.filter(function (_, i) { return i !== index; }); });
    };
    var handleUpload = function () {
        onUpload(selectedFiles);
        setSelectedFiles([]);
        onClose();
    };
    return (<material_1.Dialog open={open} onClose={onClose} maxWidth="md" fullWidth PaperProps={{
            sx: {
                borderRadius: '12px',
                padding: '16px',
                boxShadow: function (theme) { return theme.palette.mode === 'dark'
                    ? '0 4px 6px rgba(0,0,0,0.2)'
                    : '0 4px 6px rgba(0,0,0,0.1)'; },
            },
        }}>
      <material_1.DialogTitle sx={{
            padding: '0 0 16px 0',
            color: function (theme) { return theme.palette.text.primary; },
            fontSize: '20px',
            fontWeight: 600,
        }}>
        {t.screenshotManager.addScreenshot}
      </material_1.DialogTitle>
      <material_1.DialogContent sx={{ padding: '0' }}>
        <input accept="image/*" style={{ display: 'none' }} id="upload-images" multiple type="file" onChange={handleFileSelect}/>
        <label htmlFor="upload-images">
          <DropZone isDragActive={isDragActive} onDrop={handleDrop} onDragOver={handleDragOver} onDragLeave={handleDragLeave}>
            <CloudUpload_1.default sx={{ fontSize: 48, color: '#4285f4', mb: 2 }}/>
            <material_1.Typography variant="h6" gutterBottom>
              {t.screenshotManager.dragAndDrop}
            </material_1.Typography>
            <material_1.Typography variant="body2" color="text.secondary">
              {t.screenshotManager.orClick}
            </material_1.Typography>
          </DropZone>
        </label>

        {selectedFiles.length > 0 && (<PreviewGrid>
            {selectedFiles.map(function (file, index) { return (<PreviewCard key={index}>
                <PreviewImage src={URL.createObjectURL(file)} alt={"Preview ".concat(index)}/>
                <DeleteButton className="delete-button" onClick={function () { return handleDelete(index); }}>
                  <Delete_1.default />
                </DeleteButton>
              </PreviewCard>); })}
          </PreviewGrid>)}
      </material_1.DialogContent>
      <material_1.DialogActions sx={{ padding: '16px 0 0 0' }}>
        <material_1.Button onClick={onClose} sx={{
            color: function (theme) { return theme.palette.text.secondary; },
            '&:hover': {
                backgroundColor: function (theme) { return theme.palette.mode === 'dark'
                    ? 'rgba(255, 255, 255, 0.08)'
                    : 'rgba(0, 0, 0, 0.04)'; },
            },
        }}>
          {t.screenshotManager.cancel}
        </material_1.Button>
        <material_1.Button variant="contained" onClick={handleUpload} disabled={selectedFiles.length === 0} sx={{
            backgroundColor: function (theme) { return theme.palette.primary.main; },
            '&:hover': {
                backgroundColor: function (theme) { return theme.palette.primary.dark; },
            },
            '&.Mui-disabled': {
                backgroundColor: function (theme) { return theme.palette.mode === 'dark'
                    ? 'rgba(255, 255, 255, 0.12)'
                    : '#e0e0e0'; },
                color: function (theme) { return theme.palette.mode === 'dark'
                    ? 'rgba(255, 255, 255, 0.3)'
                    : '#9e9e9e'; },
            },
        }}>
          {t.screenshotManager.import}
        </material_1.Button>
      </material_1.DialogActions>
    </material_1.Dialog>);
};
exports.default = UploadDialog;
