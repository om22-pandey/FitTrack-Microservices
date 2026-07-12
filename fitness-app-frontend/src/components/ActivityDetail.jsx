import React, { useEffect, useState } from 'react';
// import { useParams, useNavigate } from 'react-router';
import { getActivityDetail } from '../services/api';
import { 
  Box, Card, CardContent, Divider, Typography, Button, 
  Grid2, Chip, LinearProgress, Skeleton 
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import DownloadIcon from '@mui/icons-material/Download';
import ShareIcon from '@mui/icons-material/Share';
// import { useLocation } from "react-router-dom";
// import {
//   useNavigate,
//   useParams,
//   useLocation
// } from "react-router-dom";
import { useNavigate, useParams, useLocation } from "react-router";

// Recharts & Extensions
import { ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import jsPDF from 'jspdf';
import Confetti from 'react-confetti';
import CountUp from 'react-countup';

const ActivityDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [loading, setLoading] = useState(true);
  const [recommendation, setRecommendation] = useState(null);

  const passedActivity = location.state?.activity;
  const [activity, setActivity] = useState(passedActivity || null);

  const configMap = {
    RUNNING: { color: '#3b82f6', icon: '🏃' },
    WALKING: { color: '#10b981', icon: '🚶' },
    CYCLING: { color: '#f59e0b', icon: '🚴' },
    YOGA: { color: '#a855f7', icon: '🧘' },
    SWIMMING: { color: '#06b6d4', icon: '🏊' },
    GYM: { color: '#ec4899', icon: '🏋️' }
  };

  const activityType = activity?.type || recommendation?.activityType;
  const themeColor = configMap[activityType?.toUpperCase()]?.color || "#3b82f6";
  const activityIcon = configMap[activityType?.toUpperCase()]?.icon || "🏋️";

  useEffect(() => {
    const fetchDetail = async () => {
      try {
        if (passedActivity) {
          setActivity(passedActivity);
        }
        const response = await getActivityDetail(id);
        setRecommendation(response.data);
      } catch (error) {
        console.error("Detail Fetch Error:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchDetail();
  }, [id, passedActivity]);

  if (loading) {
    return (
      <Box sx={{ maxWidth: 1100, mx: 'auto', p: 1 }}>
        <Skeleton variant="rounded" height={120} sx={{ mb: 3, borderRadius: 4 }} />
        <Skeleton variant="rounded" height={350} sx={{ borderRadius: 3 }} />
      </Box>
    );
  }

  if (!activity) return <Typography sx={{ p: 4 }} textAlign="center">Activity logs not found.</Typography>;

  // --- Calculations ---
  const calories = Number(activity.caloriesBurned) || 0;
  const duration = Number(activity.duration) || 0;
  const goalDuration = Number(activity.goalDuration) || 45; 
  const goalPercentage = Math.round((duration / goalDuration) * 100);
  const efficiency = duration > 0 ? (calories / duration).toFixed(1) : "0.0";

  const calculateAIScore = () => {
    let score = 60;
    if (duration >= 30) score += 20;
    if (calories >= 300) score += 20;
    return Math.min(score, 100);
  };
  const aiScore = calculateAIScore();

  const getWorkoutTimeOfDay = (dateString) => {
    if (!dateString) return 'Active ⚡';
    const hours = new Date(dateString).getHours();
    if (hours < 12) return 'Morning 🌅';
    if (hours < 17) return 'Afternoon ☀️';
    if (hours < 21) return 'Evening 🌇';
    return 'Night 🌙';
  };
  const timeOfDay = getWorkoutTimeOfDay(activity.createdAt);

  const donutData = [
    { name: 'Duration Factor', value: Math.max(duration * 10, 10), color: themeColor },
    { name: 'Calories Factor', value: Math.max(calories, 10), color: '#10b981' },
    { name: 'Performance Metric', value: aiScore * 5, color: '#a855f7' }
  ];

  const downloadPDFReport = () => {
    const doc = new jsPDF();
    doc.setFont("Helvetica", "bold");
    doc.setFontSize(22);
    doc.text("WORKOUT SUMMARY REPORT", 20, 20);
    doc.setFontSize(14);
    doc.text(`Workout Profile: ${activityType || 'Workout'}`, 20, 35);
    doc.text(`Duration: ${duration} Minutes`, 20, 45);
    doc.text(`Calories Burned: ${calories} kcal`, 20, 55);
    doc.text(`Efficiency Rate: ${efficiency} kcal/min`, 20, 65);
    doc.save(`Workout_Report_${activity.id || 'Detail'}.pdf`);
  };

  return (
    <Box sx={{ maxWidth: 1100, mx: 'auto', p: 1 }}>
      {aiScore >= 80 && calories > 0 && <Confetti recycle={false} numberOfPieces={150} />}

      <Box display="flex" justifyContent="space-between" flexWrap="wrap" gap={2} mb={3}>
        <Button startIcon={<ArrowBackIcon />} onClick={() => navigate('/activities')} sx={{ textTransform: 'none' }}>
          Back to Dashboard
        </Button>
        <Box display="flex" gap={1.5}>
          <Button variant="outlined" startIcon={<ShareIcon />} onClick={() => navigator.clipboard.writeText(window.location.href)} sx={{ textTransform: 'none', borderRadius: 2 }}>
            Copy Link
          </Button>
          <Button variant="contained" startIcon={<DownloadIcon />} onClick={downloadPDFReport} sx={{ textTransform: 'none', borderRadius: 2 }}>
            Download Report
          </Button>
        </Box>
      </Box>

      {/* Top Banner Widget */}
      <Card sx={{ borderRadius: 4, border: "1px solid", borderColor: "divider", background: `linear-gradient(135deg, ${themeColor}15, transparent)`, mb: 3 }} elevation={0}>
        <CardContent sx={{ p: 3, display: 'flex', flexWrap: 'wrap', gap: 3, justifyContent: 'space-between', alignItems: 'center' }}>
          <Box display="flex" alignItems="center" gap={2}>
            <Typography sx={{ fontSize: 48 }}>{activityIcon}</Typography>
            <Box>
              <Typography variant="h5" fontWeight="bold">{activityType || 'Workout'}</Typography>
              <Typography variant="body2" color="text.secondary">Time-Slot: <strong>{timeOfDay}</strong></Typography>
            </Box>
          </Box>
          
          <Box>
            <Typography variant="caption" color="text.secondary" display="block" textAlign="right">Workout Rank</Typography>
            <Chip label={duration > 30 ? "⭐⭐⭐⭐ High" : "⭐⭐ Baseline"} size="small" variant="outlined" sx={{ borderColor: themeColor, fontWeight: 'bold', mt: 0.5 }} />
          </Box>
        </CardContent>
      </Card>

      <Grid2 container spacing={3}>
        {/* Left Stats Column */}
        <Grid2 size={{ xs: 12, md: 4 }}>
          <Grid2 container spacing={2}>
            {/* Calories Card */}
            <Grid2 size={{ xs: 12 }}>
              <Card sx={{ borderRadius: 3, border: "1px solid", borderColor: "divider" }} elevation={0}>
                <CardContent>
                  <Typography variant="caption" color="text.secondary" fontWeight="bold">🔥 BURNT METRICS</Typography>
                  <Typography variant="h4" fontWeight="900" my={0.5} sx={{ color: themeColor }}>
                    <CountUp end={calories} duration={1} suffix=" kcal" />
                  </Typography>
                </CardContent>
              </Card>
            </Grid2>

            {/* Workout Completion */}
            <Grid2 size={{ xs: 12 }}>
              <Card sx={{ borderRadius: 3, border: "1px solid", borderColor: "divider" }} elevation={0}>
                <CardContent>
                  <Box display="flex" justifyContent="space-between" mb={1}>
                    <Typography variant="caption" color="text.secondary" fontWeight="bold">⏱️ WORKOUT COMPLETION</Typography>
                    <Typography variant="caption" fontWeight="bold">{goalPercentage}%</Typography>
                  </Box>
                  <Typography variant="h6" fontWeight="bold" mb={1}>{duration} / {goalDuration} min</Typography>
                  <LinearProgress value={Math.min(goalPercentage, 100)} variant="determinate" sx={{ height: 8, borderRadius: 2 }} color="success" />
                </CardContent>
              </Card>
            </Grid2>

            {/* Efficiency Card */}
            <Grid2 size={{ xs: 12 }}>
              <Card sx={{ borderRadius: 3, border: "1px solid", borderColor: "divider" }} elevation={0}>
                <CardContent>
                  <Typography variant="caption" color="text.secondary" fontWeight="bold">⚡ CALORIES EFFICIENCY</Typography>
                  <Typography variant="h4" fontWeight="900" my={0.5}>{efficiency} <Typography variant="caption" color="text.secondary">kcal/min</Typography></Typography>
                  <Typography variant="caption" color="text.secondary">Kilocalories spent per minute active.</Typography>
                </CardContent>
              </Card>
            </Grid2>
          </Grid2>
        </Grid2>

        {/* Center Donut Graph Column */}
        <Grid2 size={{ xs: 12, md: 4 }}>
          <Card sx={{ height: '100%', borderRadius: 3, border: "1px solid", borderColor: "divider" }} elevation={0}>
            <CardContent sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
              <Typography variant="subtitle2" fontWeight="bold" sx={{ mb: 2, width: '100%', textAlign: 'left' }}>Distribution Donut (Pie)</Typography>
              
              <Box sx={{ width: '100%', height: 160, position: 'relative', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={donutData} cx="50%" cy="50%" innerRadius={55} outerRadius={70} paddingAngle={4} dataKey="value">
                      {donutData.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.color} />)}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
                
                <Box sx={{ position: 'absolute', textAlign: 'center' }}>
                  <Typography variant="h4" fontWeight="900"><CountUp end={calories > 0 ? aiScore : 0} duration={1} /></Typography>
                  <Typography variant="caption" color="success.main" fontWeight="bold" sx={{ fontSize: 10 }}>{calories > 0 ? "Excellent" : "Baseline"}</Typography>
                </Box>
              </Box>
              <Typography variant="caption" color="text.secondary" sx={{ mt: 1 }}>Dynamic internal allocation matrix.</Typography>
            </CardContent>
          </Card>
        </Grid2>

        {/* Right Lifecycle Timeline Column */}
        <Grid2 size={{ xs: 12, md: 4 }}>
          <Card sx={{ height: '100%', borderRadius: 3, border: "1px solid", borderColor: "divider" }} elevation={0}>
            <CardContent>
              <Typography variant="subtitle2" fontWeight="bold" mb={2}>Activity Lifecycle Timeline</Typography>
              <Box display="flex" flexDirection="column" gap={2} pl={1} sx={{ position: 'relative', borderLeft: '2px dashed rgba(128,128,128,0.3)' }}>
                <Box>
                  <Typography variant="caption" color="primary" fontWeight="bold" display="block">STEP 1 • LOGGED TIME</Typography>
                  <Typography variant="body2">{activity.createdAt ? new Date(activity.createdAt).toLocaleDateString() : 'Today'} ({timeOfDay.split(' ')[0]})</Typography>
                </Box>
                <Box>
                  <Typography variant="caption" color="success.main" fontWeight="bold" display="block">STEP 2 • ACTIVITY METRICS</Typography>
                  
                  <Typography variant="body2">{activityType || 'Workout'} — Processed successfully</Typography>
                </Box>
                <Box>
                  <Typography variant="caption" color="purple" fontWeight="bold" display="block">STEP 3 • PERFORMANCE METRIC</Typography>
                  <Typography variant="body2">Efficiency tracked at {efficiency} kcal/min</Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid2>
      </Grid2>

      {/* AI Insights Display */}
      {recommendation && (
        <Card sx={{ borderRadius: 3, border: "1px solid", borderColor: "divider", mt: 3 }} elevation={0}>
          <CardContent sx={{ p: 3 }}>
            <Typography variant="h5" fontWeight="bold" color="primary" gutterBottom>✨ Detailed AI System Insights</Typography>
            
            <Typography variant="subtitle1" fontWeight="bold" sx={{ mt: 2 }}>Analysis Engine Feedback</Typography>
            <Typography paragraph color="text.secondary">{recommendation?.recommendation}</Typography>
            
            {recommendation?.improvements?.length > 0 && (
              <>
                <Divider sx={{ my: 2 }} />
                <Typography variant="subtitle1" fontWeight="bold">Improvements</Typography>
                {recommendation.improvements.map((item, index) => (
                  <Typography key={index} paragraph sx={{ mb: 0.5 }} color="text.secondary">
                    • {item}
                  </Typography>
                ))}
              </>
            )}

            {recommendation?.suggestions?.length > 0 && (
              <>
                <Divider sx={{ my: 2 }} />
                <Typography variant="subtitle1" fontWeight="bold">Suggestions</Typography>
                {recommendation.suggestions.map((item, index) => (
                  <Typography key={index} paragraph sx={{ mb: 0.5 }} color="text.secondary">
                    • {item}
                  </Typography>
                ))}
              </>
            )}

            {recommendation?.safety?.length > 0 && (
              <>
                <Divider sx={{ my: 2 }} />
                <Typography variant="subtitle1" fontWeight="bold" color="error.main">Safety Guidelines</Typography>
                {recommendation.safety.map((item, index) => (
                  <Typography key={index} paragraph sx={{ mb: 0.5 }} color="text.secondary">
                    • {item}
                  </Typography>
                ))}
              </>
            )}
          </CardContent>
        </Card>
      )}
    </Box>
  );
};

export default ActivityDetail;