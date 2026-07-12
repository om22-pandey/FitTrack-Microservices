import React from "react";
import { Box, Button, Card, CardContent, Chip, Grid2, Typography } from "@mui/material";
import { useNavigate } from "react-router";
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';

const ActivityList = ({ activities = [] }) => {
  const navigate = useNavigate();

  if (activities.length === 0) {
    return (
      <Typography color="text.secondary" variant="body1" textAlign="center" sx={{ py: 4 }}>
        No activities found for the selected filter.
      </Typography>
    );
  }

  const getActivityIcon = (type) => {
    switch (type?.toUpperCase()) {
      case "RUNNING": return "🏃";
      case "WALKING": return "🚶";
      case "CYCLING": return "🚴";
      case "YOGA": return "🧘";
      case "SWIMMING": return "🏊";
      case "GYM": return "🏋️";
      default: return "🏋️";
    }
  };

  return (
    <Grid2 container spacing={2.5}>
      {activities.map((activity) => {
        const formattedDate = activity.createdAt 
          ? new Date(activity.createdAt).toLocaleString('en-US', {
              month: 'short',
              day: 'numeric',
              hour: '2-digit',
              minute: '2-digit'
            })
          : "Just now";

        return (
          <Grid2 key={activity.id} size={{ xs: 12, sm: 6 }}>
            <Card
              elevation={0}
              sx={{
                borderRadius: 3,
                border: "1px solid",
                borderColor: "divider",
                transition: "all .25s ease",
                cursor: "pointer",
                "&:hover": {
                  transform: "translateY(-4px)",
                  boxShadow: "0 12px 24px rgba(0,0,0,0.06)",
                  borderColor: "primary.main"
                },
              }}
              onClick={() =>
                navigate(`/activities/${activity.id}`, {
                  state: { activity }
                })
              }
            >
              <CardContent sx={{ p: 3 }}>
                <Box display="flex" justifyContent="space-between" alignItems="center" mb={1.5}>
                  <Typography variant="h6" fontWeight="bold">
                    {getActivityIcon(activity.type)} {activity.type}
                  </Typography>
                  <Chip
                    label={`${activity.caloriesBurned} kcal`}
                    color="success"
                    size="small"
                    sx={{ fontWeight: "bold" }}
                  />
                </Box>

                <Box display="flex" alignItems="center" gap={0.8} mb={2} color="text.secondary">
                  <CalendarMonthIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
                  <Typography variant="caption" fontWeight="600">
                    {formattedDate}
                  </Typography>
                </Box>

                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.8, mb: 2.5 }}>
                  <Typography variant="body2" color="text.secondary">
                    ⏱️ Duration: <strong>{activity.duration} min</strong>
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    🔥 Burned: <strong>{activity.caloriesBurned} calories</strong>
                  </Typography>
                </Box>

                <Button
                  fullWidth
                  variant="outlined"
                  size="small"
                  sx={{ textTransform: "none", borderRadius: 2 }}
                  onClick={(e) => {
                    e.stopPropagation();
                    navigate(`/activities/${activity.id}`, {
                      state: { activity }
                    });
                  }}
                >
                  View Details
                </Button>
              </CardContent>
            </Card>
          </Grid2>
        );
      })}
    </Grid2>
  );
};

export default ActivityList;