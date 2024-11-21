import React, { useState } from 'react';
import { TextField, Button, MenuItem, InputAdornment } from '@mui/material';
import { NavigateNext, Person, Phone, Category } from '@mui/icons-material';

function ComplaintFormStep1({ nextStep, formData, setFormData }) {
  const [errors, setErrors] = useState({});

  const validateFields = () => {
    let newErrors = {};
    if (!formData.complaintCategory) newErrors.complaintCategory = 'Please select a category.';
    if (!formData.fullName) newErrors.fullName = 'Full name is required.';
    if (!formData.phonenumber) {
      newErrors.phonenumber = 'Phone number is required.';
    } else if (!/^\d{10}$/.test(formData.phonenumber)) {
      newErrors.phonenumber = 'Enter a valid 10-digit phone number.';
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
        Step 1: Complaint Details
      </h3>

      <TextField
        label="Complaint Category"
        fullWidth
        value={formData.complaintCategory}
        onChange={(e) =>
          setFormData({ ...formData, complaintCategory: e.target.value })
        }
        select
        sx={{ marginBottom: 2 }}
        error={!!errors.complaintCategory}
        helperText={errors.complaintCategory}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <Category color="action" />
            </InputAdornment>
          ),
        }}
      >
        <MenuItem value="Sex Trafficking">Sex Trafficking</MenuItem>
        <MenuItem value="Labor Trafficking">Labor Trafficking</MenuItem>
        <MenuItem value="Child Trafficking">Child Trafficking</MenuItem>
        <MenuItem value="Other">Other</MenuItem>
      </TextField>

      <TextField
        label="Full Name"
        fullWidth
        value={formData.fullName}
        onChange={(e) =>
          setFormData({ ...formData, fullName: e.target.value })
        }
        sx={{ marginBottom: 2 }}
        error={!!errors.fullName}
        helperText={errors.fullName}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <Person color="action" />
            </InputAdornment>
          ),
        }}
      />

      <TextField
        label="Phone Number"
        fullWidth
        value={formData.phonenumber}
        onChange={(e) =>
          setFormData({ ...formData, phonenumber: e.target.value })
        }
        sx={{ marginBottom: 2 }}
        error={!!errors.phonenumber}
        helperText={errors.phonenumber}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <Phone color="action" />
            </InputAdornment>
          ),
        }}
      />

      <Button
        variant="contained"
        color="primary"
        fullWidth
        onClick={handleNext}
        endIcon={<NavigateNext />}
        sx={{
          backgroundColor: '#003366',
          '&:hover': { backgroundColor: '#00509E' },
          marginTop: '20px',
        }}
      >
        Next
      </Button>
    </div>
  );
}

export default ComplaintFormStep1;
