import React, { useState } from "react";
import { Box, Button, Divider, FormControl, InputLabel, MenuItem, Paper, Select, TextField, Typography } from "@mui/material";
import { addActivity } from "../services/api";

const ActivityForm = ({ onActivityAdded }) => {
  const [activity, setActivity] = useState({
    type: "RUNNING",
    duration: "",
    caloriesBurned: "",
    additionalMetrics: {},
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!activity.duration || !activity.caloriesBurned) return;

    try {
      await addActivity(activity);
      setActivity({
        type: "RUNNING",
        duration: "",
        caloriesBurned: "",
        additionalMetrics: {},
      });
      onActivityAdded();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Paper
      elevation={0}
      sx={{
        borderRadius: 3,
        p: 3,
        border: "1px solid",
        borderColor: "divider"
      }}
    >
      <Typography variant="h6" fontWeight="bold">
        Add Activity
      </Typography>
      <Typography color="text.secondary" variant="body2" sx={{ mb: 2 }}>
        Record today's workout.
      </Typography>
      <Divider sx={{ mb: 2.5 }} />

      <Box component="form" onSubmit={handleSubmit}>
        <FormControl fullWidth sx={{ mb: 2.5 }} size="small">
          <InputLabel>Activity Type</InputLabel>
          <Select
            value={activity.type}
            label="Activity Type"
            onChange={(e) => setActivity({ ...activity, type: e.target.value })}
          >
            <MenuItem value="RUNNING">🏃 Running</MenuItem>
            <MenuItem value="WALKING">🚶 Walking</MenuItem>
            <MenuItem value="CYCLING">🚴 Cycling</MenuItem>
          </Select>
        </FormControl>

        <TextField
          fullWidth
          label="Duration (Minutes)"
          type="number"
          size="small"
          sx={{ mb: 2.5 }}
          value={activity.duration}
          onChange={(e) => setActivity({ ...activity, duration: e.target.value })}
        />

        <TextField
          fullWidth
          label="Calories Burned"
          type="number"
          size="small"
          sx={{ mb: 3 }}
          value={activity.caloriesBurned}
          onChange={(e) => setActivity({ ...activity, caloriesBurned: e.target.value })}
        />

        <Button
          fullWidth
          variant="contained"
          type="submit"
          sx={{
            py: 1.2,
            borderRadius: 2,
            fontWeight: "bold",
            textTransform: "none"
          }}
        >
          Add Activity
        </Button>
      </Box>
    </Paper>
  );
};

export default ActivityForm;