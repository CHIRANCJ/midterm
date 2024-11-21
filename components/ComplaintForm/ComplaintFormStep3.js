import React, { useState } from 'react';
import { Button, TextField, Grid, Typography, Tooltip, IconButton } from '@mui/material';
import { ArrowBack, NavigateNext, UploadFile } from '@mui/icons-material';

function ComplaintFormStep3({ nextStep, prevStep, formData, setFormData }) {
  const [evidenceDescription, setEvidenceDescription] = useState(
    formData.evidenceDescription || ''
  );
  const [evidenceFiles, setEvidenceFiles] = useState(
    formData.evidenceFiles || []
  );

  // Handle file selection
  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    const updatedFiles = [...evidenceFiles, ...files];
    setEvidenceFiles(updatedFiles);

    // Log file details
    console.log('Added files:', files);
  };

  // Save data and proceed to the next step
  const handleNext = () => {
    setFormData({
      ...formData,
      evidenceDescription,
      evidenceFiles,
    });
    console.log('Evidence Description:', evidenceDescription);
    console.log('Evidence Files:', evidenceFiles);

    nextStep();
  };

  return (
    <div style={{ padding: '20px', maxWidth: '600px', margin: '0 auto' }}>
      <Typography variant="h5" gutterBottom sx={{ textAlign: 'center', mb: 2 }}>
        Step 3: Upload Evidence
      </Typography>

      {/* File upload button */}
      <Tooltip title="Select files to upload">
        <Button
          variant="outlined"
          component="label"
          startIcon={<UploadFile />}
          sx={{ width: '100%', marginBottom: 2 }}
        >
          Upload Evidence Files
          <input
            type="file"
            accept=".jpg,.png,.mp4,.mov"
            multiple
            hidden
            onChange={handleFileChange}
          />
        </Button>
      </Tooltip>

      {/* File count display */}
      {evidenceFiles.length > 0 && (
        <Typography
          variant="body2"
          color="textSecondary"
          sx={{ marginBottom: 2 }}
        >
          {evidenceFiles.length} file(s) selected.
        </Typography>
      )}

      {/* Evidence description */}
      <TextField
        label="Evidence Description"
        fullWidth
        multiline
        rows={4}
        value={evidenceDescription}
        onChange={(e) => setEvidenceDescription(e.target.value)}
        sx={{
          marginBottom: 2,
          '& .MuiInputBase-root': {
            borderRadius: 1.5,
          },
        }}
      />

      <Grid container spacing={2}>
        <Grid item xs={6}>
          <Button
            variant="outlined"
            color="secondary"
            fullWidth
            onClick={prevStep}
            startIcon={<ArrowBack />}
          >
            Back
          </Button>
        </Grid>

        <Grid item xs={6}>
          <Button
            variant="contained"
            color="primary"
            fullWidth
            onClick={handleNext}
            endIcon={<NavigateNext />}
          >
            Next
          </Button>
        </Grid>
      </Grid>
    </div>
  );
}

export default ComplaintFormStep3;
