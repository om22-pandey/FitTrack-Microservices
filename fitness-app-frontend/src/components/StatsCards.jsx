import React, { useState, useMemo } from "react";
import { Card, CardContent, Grid2, Typography, Box, FormControl, Select, MenuItem, InputLabel } from "@mui/material";

const StatsCards = ({ activities = [] }) => {
  const [timeFrame, setTimeFrame] = useState("today");

  const filteredActivities = useMemo(() => {
    const now = new Date();
    const todayStr = now.toISOString().split("T")[0]; // Timezone-safe 

    return activities.filter((item) => {
      if (!item.createdAt) return false;
      const actDate = new Date(item.createdAt);
      const actDateStr = item.createdAt.split("T")[0];

      if (timeFrame === "today") {
        return actDateStr === todayStr;
      } 
      
      if (timeFrame === "week") {
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(now.getDate() - 7);
        return actDate >= sevenDaysAgo && actDate <= now;
      } 
      
      if (timeFrame === "month") {
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(now.getDate() - 30);
        return actDate >= thirtyDaysAgo && actDate <= now;
      }

      return true;
    });
  }, [activities, timeFrame]);

  const totalActivities = filteredActivities.length;

  const totalCalories = filteredActivities.reduce(
    (sum, item) => sum + Number(item.caloriesBurned || 0),
    0
  );

  const totalMinutes = filteredActivities.reduce(
    (sum, item) => sum + Number(item.duration || 0),
    0
  );

  const getGoalStatus = () => {
    if (timeFrame === "today") return totalActivities >= 1 ? "Completed" : "In Progress";
    if (timeFrame === "week") return totalActivities >= 5 ? "Completed" : "In Progress";
    return totalActivities >= 20 ? "Completed" : "In Progress";
  };

  const cards = [
    { title: "Activities", value: totalActivities, icon: "📊", color: "#3b82f6" },
    { title: "Calories", value: `${totalCalories} kcal`, icon: "🔥", color: "#ef4444" },
    { title: "Workout Time", value: `${totalMinutes} min`, icon: "⏱️", color: "#10b981" },
    { title: "Goal Progress", value: getGoalStatus(), icon: "🎯", color: "#f59e0b" },
  ];

  return (
    <Box sx={{ mb: 2 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" sx={{ mb: 3 }}>
        <Typography variant="subtitle1" fontWeight="bold" color="text.secondary">
          Overview Metrics
        </Typography>
        
        <FormControl size="small" sx={{ minWidth: 140 }}>
          <InputLabel id="timeframe-select-label">Time Period</InputLabel>
          <Select
            labelId="timeframe-select-label"
            value={timeFrame}
            label="Time Period"
            onChange={(e) => setTimeFrame(e.target.value)}
            sx={{ borderRadius: 2 }}
          >
            <MenuItem value="today">📅 Today</MenuItem>
            <MenuItem value="week">🗓️ This Week</MenuItem>
            <MenuItem value="month">📊 This Month</MenuItem>
          </Select>
        </FormControl>
      </Box>

      <Grid2 container spacing={3}>
        {cards.map((card) => (
          <Grid2 key={card.title} size={{ xs: 12, sm: 6, md: 3 }}>
            <Card
              elevation={0}
              sx={{
                borderRadius: 3,
                border: "1px solid",
                borderColor: "divider",
                position: "relative",
                overflow: "hidden",
                transition: "all .25s ease-in-out",
                "&:hover": {
                  transform: "translateY(-4px)",
                  boxShadow: "0 10px 20px rgba(0,0,0,0.05)",
                  borderColor: card.color
                },
              }}
            >
              <CardContent sx={{ p: 3 }}>
                <Box display="flex" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
                  <Typography color="text.secondary" variant="subtitle2" fontWeight="bold" sx={{ flexGrow: 1 }}>
                    {card.title}
                  </Typography>
                  <Typography sx={{ fontSize: 26, lineHeight: 1 }}>{card.icon}</Typography>
                </Box>
                <Typography variant="h5" fontWeight="800">
                  {card.value}
                </Typography>
              </CardContent>
            </Card>
          </Grid2>
        ))}
      </Grid2>
    </Box>
  );
};

export default StatsCards;