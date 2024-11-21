import React, { useState } from 'react';
import {
  Button,
  TextField,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  InputAdornment,
} from '@mui/material';
import { ArrowBack, NavigateNext, Person, LocationOn, CalendarToday,Event } from '@mui/icons-material';

function ComplaintFormStep2({ nextStep, prevStep, formData, setFormData }) {
  const [errors, setErrors] = useState({});
  const today = new Date().toISOString().split('T')[0];
  const validateFields = () => {
    let newErrors = {};
    if (!formData.victimName) newErrors.victimName = "Victim's name is required.";
    if (!formData.victimAge) newErrors.victimAge = "Victim's age is required.";
    if (formData.victimAge <= 0) newErrors.victimAge = "Age must be a positive number.";
    if (!formData.victimGender) newErrors.victimGender = "Please select victim's gender.";
    if (!formData.suspectName) newErrors.suspectName = "Suspect's name is required.";
    if (!formData.location) newErrors.location = 'Location of the incident is required.';
    if (!formData.dateOfIncident) {
      newErrors.dateOfIncident = "Date of incident is required";
    } else if (formData.dateOfIncident > today) {
      newErrors.dateOfIncident = "Incident date cannot be in the future";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0; // Returns true if no errors
  };

  const handleNext = () => {
    if (validateFields()) nextStep();
  };

  return (
    <div>
      <h3 style={{ textAlign: 'center', color: '#003366', marginBottom: '20px' }}>
        Step 2: Victim Information
      </h3>

      <TextField
        label="Victim's Name"
        fullWidth
        value={formData.victimName}
        onChange={(e) => setFormData({ ...formData, victimName: e.target.value })}
        sx={{ marginBottom: 2 }}
        error={!!errors.victimName}
        helperText={errors.victimName}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <Person color="action" />
            </InputAdornment>
          ),
        }}
      />

      <TextField
        label="Victim's Age"
        fullWidth
        type="number"
        value={formData.victimAge}
        onChange={(e) => setFormData({ ...formData, victimAge: e.target.value })}
        sx={{ marginBottom: 2 }}
        error={!!errors.victimAge}
        helperText={errors.victimAge}
      />

      <FormControl fullWidth sx={{ marginBottom: 2 }} error={!!errors.victimGender}>
        <InputLabel>Victim's Gender</InputLabel>
        <Select
          value={formData.victimGender}
          onChange={(e) => setFormData({ ...formData, victimGender: e.target.value })}
        >
          <MenuItem value="Male">Male</MenuItem>
          <MenuItem value="Female">Female</MenuItem>
          <MenuItem value="Other">Other</MenuItem>
        </Select>
      </FormControl>
      {errors.victimGender && (
        <span style={{ color: 'red', fontSize: '12px' }}>{errors.victimGender}</span>
      )}

      <TextField
        label="Suspect's Name"
        fullWidth
        value={formData.suspectName}
        onChange={(e) => setFormData({ ...formData, suspectName: e.target.value })}
        sx={{ marginBottom: 2 }}
        error={!!errors.suspectName}
        helperText={errors.suspectName}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <Person color="error" />
            </InputAdornment>
          ),
        }}
      />

      <TextField
        label="Location of Incident"
        fullWidth
        value={formData.location}
        onChange={(e) => setFormData({ ...formData, location: e.target.value })}
        sx={{ marginBottom: 2 }}
        error={!!errors.location}
        helperText={errors.location}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <LocationOn color="primary" />
            </InputAdornment>
          ),
        }}
      />

<TextField
        label="Date of Incident"
        fullWidth
        type="date"
        value={formData.dateOfIncident}
        onChange={(e) =>
          setFormData({ ...formData, dateOfIncident: e.target.value })
        }
        error={!!errors.dateOfIncident}
        helperText={errors.dateOfIncident}
        sx={{ marginBottom: 2 }}
        InputLabelProps={{
          shrink: true,
        }}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <Event />
            </InputAdornment>
          ),
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
            sx={{
              backgroundColor: '#003366',
              '&:hover': { backgroundColor: '#00509E' },
            }}
          >
            Next
          </Button>
        </Grid>
      </Grid>
    </div>
  );
}

export default ComplaintFormStep2;
