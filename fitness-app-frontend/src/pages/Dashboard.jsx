// import React, { useEffect, useState, useMemo } from "react";
// import { Box, Typography, Grid2, Card, CardContent, Tooltip as MuiTooltip, Skeleton, Button, FormControl, Select, MenuItem, InputLabel } from "@mui/material";
// import RefreshIcon from '@mui/icons-material/Refresh';
// import LocalFireDepartmentIcon from '@mui/icons-material/LocalFireDepartment';
// import ActivityForm from "../components/ActivityForm";
// import ActivityList from "../components/ActivityList";
// import StatsCards from "../components/StatsCards";
// import { getActivities } from "../services/api";
// import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, Legend } from 'recharts';
// import {Link } from "@mui/material";
// import GitHubIcon from "@mui/icons-material/GitHub";
// import LinkedInIcon from "@mui/icons-material/LinkedIn";

// const Dashboard = () => {
//   const [activities, setActivities] = useState([]);
//   const [loading, setLoading] = useState(true);
  
//   const [listTimeFrame, setListTimeFrame] = useState("all");

//   const fetchActivities = async (showSkeleton = false) => {
//     if (showSkeleton) setLoading(true);
//     try {
//       const response = await getActivities();
//       const rawData = response.data || [];
//       const sortedData = [...rawData].sort((a, b) => {
//         if (a.createdAt && b.createdAt) return new Date(b.createdAt) - new Date(a.createdAt);
//         if (a.id && b.id) return Number(b.id) - Number(a.id);
//         return 0;
//       });
//       setActivities(sortedData);
//     } catch (error) {
//       console.error("Error fetching activities:", error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchActivities(true);
//     const intervalId = setInterval(() => {
//       fetchActivities(false);
//     }, 30000);
//     return () => clearInterval(intervalId);
//   }, []);

//   const handleActivityAdded = (newActivity) => {
//     if (newActivity) {
//       setActivities((prev) => {
//         const updatedList = [newActivity, ...prev];
//         return updatedList.sort((a, b) => {
//           if (a.createdAt && b.createdAt) return new Date(b.createdAt) - new Date(a.createdAt);
//           if (a.id && b.id) return Number(b.id) - Number(a.id);
//           return 0;
//         });
//       });
//     } else {
//       fetchActivities(false);
//     }
//   };

//   // --- Dynamic Time-Frame Filtering for Recent Activities ---
//   const filteredActivities = useMemo(() => {
//     const now = new Date();
//     const todayStr = now.toISOString().split("T")[0];

//     return activities.filter((item) => {
//       if (listTimeFrame === "all") return true;
//       if (!item.createdAt) return false;

//       const actDate = new Date(item.createdAt);
//       const actDateStr = item.createdAt.split("T")[0];

//       if (listTimeFrame === "today") {
//         return actDateStr === todayStr;
//       }
//       if (listTimeFrame === "week") {
//         const sevenDaysAgo = new Date();
//         sevenDaysAgo.setDate(now.getDate() - 7);
//         return actDate >= sevenDaysAgo && actDate <= now;
//       }
//       if (listTimeFrame === "month") {
//         const thirtyDaysAgo = new Date();
//         thirtyDaysAgo.setDate(now.getDate() - 30);
//         return actDate >= thirtyDaysAgo && actDate <= now;
//       }
//       return true;
//     });
//   }, [activities, listTimeFrame]);

//   // --- Streak Logic ---
//   const currentStreak = useMemo(() => {
//     if (!activities.length) return 0;
//     const sortedDates = activities
//       .map(a => a.createdAt ? a.createdAt.split("T")[0] : null)
//       .filter((v, i, a) => v && a.indexOf(v) === i)
//       .sort((a, b) => new Date(b) - new Date(a));
    
//     let streak = 0;
//     let expected = new Date();
//     for (let i = 0; i < sortedDates.length; i++) {
//       const dStr = expected.toISOString().split('T')[0];
//       if (sortedDates.includes(dStr)) {
//         streak++;
//         expected.setDate(expected.getDate() - 1);
//       } else {
//         if (i === 0) {
//           expected.setDate(expected.getDate() - 1);
//           const yesterdayStr = expected.toISOString().split('T')[0];
//           if (sortedDates.includes(yesterdayStr)) continue;
//         }
//         break;
//       }
//     }
//     return streak;
//   }, [activities]);

//   // --- Heatmap Data Logic ---
//   const heatmapData = useMemo(() => {
//     const activityMap = {};
//     let maxCaloriesFound = 0;
//     activities.forEach(act => {
//       if (!act.createdAt) return;
//       const dateStr = act.createdAt.split("T")[0];
//       const cals = Number(act.caloriesBurned) || 0;
//       if (!activityMap[dateStr]) activityMap[dateStr] = { count: 0, totalCalories: 0 };
//       activityMap[dateStr].count += 1;
//       activityMap[dateStr].totalCalories += cals;
//       if (activityMap[dateStr].totalCalories > maxCaloriesFound) maxCaloriesFound = activityMap[dateStr].totalCalories;
//     });
//     const last7Days = Array.from({ length: 7 }).map((_, i) => {
//       const d = new Date();
//       d.setDate(d.getDate() - i);
//       return d.toISOString().split('T')[0];
//     }).reverse();
//     return last7Days.map(dateStr => {
//       const dataForDay = activityMap[dateStr] || { count: 0, totalCalories: 0 };
//       let backgroundColor = "rgba(128, 128, 128, 0.15)";
//       if (dataForDay.totalCalories > 0 && maxCaloriesFound > 0) {
//         const ratio = dataForDay.totalCalories / maxCaloriesFound;
//         backgroundColor = `rgba(21, 101, 192, ${Math.max(ratio, 0.25)})`;
//       }
//       return {
//         dateLabel: new Date(dateStr).toLocaleDateString('en-US', { weekday: 'short', day: 'numeric' }),
//         color: backgroundColor,
//         count: dataForDay.count,
//         calories: dataForDay.totalCalories
//       };
//     });
//   }, [activities]);

//   // --- Chart Data Logic ---
//   const chartData = useMemo(() => {
//     const activityMap = {};
//     activities.forEach(act => {
//       if (!act.createdAt) return;
//       const dateStr = act.createdAt.split("T")[0];
//       if (!activityMap[dateStr]) activityMap[dateStr] = { calories: 0, duration: 0 };
//       activityMap[dateStr].calories += Number(act.caloriesBurned) || 0;
//       activityMap[dateStr].duration += Number(act.duration) || 0;
//     });
//     const last7Days = Array.from({ length: 7 }).map((_, i) => {
//       const d = new Date();
//       d.setDate(d.getDate() - i);
//       return d.toISOString().split('T')[0];
//     }).reverse();
//     return last7Days.map(dateStr => {
//       const dayData = activityMap[dateStr] || { calories: 0, duration: 0 };
//       return {
//         day: new Date(dateStr).toLocaleDateString('en-US', { weekday: 'short', day: 'numeric' }),
//         Calories: dayData.calories,
//         Duration: dayData.duration
//       };
//     });
//   }, [activities]);

//   return (
//     <Box>
//       <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
//         <Typography variant="h4" fontWeight="800">Welcome Back 👋</Typography>
//         <Button 
//           variant="outlined" 
//           size="small"
//           startIcon={<RefreshIcon />}
//           onClick={() => fetchActivities(true)}
//           sx={{ textTransform: 'none', borderRadius: 2 }}
//         >
//           Refresh
//         </Button>
//       </Box>
      
//       <Typography color="text.secondary" mb={4}>
//         Track your workouts and monitor your daily progress.
//       </Typography>

//       <StatsCards activities={activities} />

//       <Grid2 container spacing={4} sx={{ mt: 2 }}>
//         {/* LEFT COLUMN */}
//         <Grid2 size={{ xs: 12, md: 4 }}>
//           <Card sx={{ mb: 3, borderRadius: 3, border: "1px solid", borderColor: "divider", background: "linear-gradient(135deg, rgba(239, 68, 68, 0.1), transparent)" }} elevation={0}>
//             <CardContent sx={{ display: 'flex', alignItems: 'center', gap: 2, py: 2 }}>
//               <Box sx={{ width: 50, height: 50, borderRadius: '50%', bgcolor: 'rgba(239, 68, 68, 0.15)', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
//                 <LocalFireDepartmentIcon sx={{ color: '#ef4444', fontSize: 32 }} />
//               </Box>
//               <Box>
//                 <Typography variant="h5" fontWeight="900" sx={{ lineHeight: 1.1 }}>{currentStreak} Days</Typography>
//                 <Typography variant="caption" color="text.secondary" fontWeight="bold">CURRENT WORKOUT STREAK</Typography>
//               </Box>
//             </CardContent>
//           </Card>

//           <ActivityForm onActivityAdded={handleActivityAdded} />
          
//           <Card sx={{ mt: 3, borderRadius: 3, border: "1px solid", borderColor: "divider" }} elevation={0}>
//             <CardContent>
//               <Typography variant="subtitle2" fontWeight="bold" mb={2}>Activity Heatmap (Last 7 Days)</Typography>
//               <Box display="flex" gap={1.2} justifyContent="start" py={0.5} flexWrap="wrap">
//                 {heatmapData.map((day, idx) => (
//                   <MuiTooltip key={idx} title={`${day.dateLabel}: ${day.count} workouts (${day.calories} kcal)`} arrow>
//                     <Box sx={{ width: 32, height: 32, borderRadius: 1, backgroundColor: day.color, cursor: 'pointer', transition: '.2s', '&:hover': { transform: 'scale(1.15)' } }} />
//                   </MuiTooltip>
//                 ))}
//               </Box>
//             </CardContent>
//           </Card>
//         </Grid2>
        
//         {/* RIGHT COLUMN */}
//         <Grid2 size={{ xs: 12, md: 8 }}>
//           <Card sx={{ mb: 4, borderRadius: 3, border: "1px solid", borderColor: "divider" }} elevation={0}>
//             <CardContent>
//               <Typography variant="subtitle2" fontWeight="bold" mb={2}>Calories vs Duration Analysis</Typography>
//               <Box sx={{ width: '100%', height: 210 }}>
//                 <ResponsiveContainer width="100%" height="100%">
//                   <BarChart data={chartData}>
//                     <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(128,128,128,0.1)"/>
//                     <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fontSize: 11 }} />
//                     <YAxis yAxisId="left" orientation="left" axisLine={false} tickLine={false} tick={{ fontSize: 10 }} />
//                     <YAxis yAxisId="right" orientation="right" axisLine={false} tickLine={false} tick={{ fontSize: 10 }} />
//                     <Tooltip cursor={{ fill: 'rgba(0,0,0,0.02)' }} />
//                     <Legend verticalAlign="top" height={36} iconType="circle"/>
//                     <Bar yAxisId="left" name="Calories (kcal)" dataKey="Calories" fill="#1565C0" radius={[4, 4, 0, 0]} />
//                     <Bar yAxisId="right" name="Duration (min)" dataKey="Duration" fill="#10b981" radius={[4, 4, 0, 0]} />
//                   </BarChart>
//                 </ResponsiveContainer>
//               </Box>
//             </CardContent>
//           </Card>

//           {/* List Header Container with Dynamic Filter Dropdown */}
//           <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
//             <Typography variant="h5" fontWeight="bold">Recent Activities</Typography>
            
//             <FormControl size="small" sx={{ minWidth: 150 }}>
//               <InputLabel id="list-filter-label">Filter Activities</InputLabel>
//               <Select
//                 labelId="list-filter-label"
//                 value={listTimeFrame}
//                 label="Filter Activities"
//                 onChange={(e) => setListTimeFrame(e.target.value)}
//                 sx={{ borderRadius: 2 }}
//               >
//                 <MenuItem value="all">🌍 All History</MenuItem>
//                 <MenuItem value="today">📅 Today</MenuItem>
//                 <MenuItem value="week">🗓️ This Week</MenuItem>
//                 <MenuItem value="month">📊 This Month</MenuItem>
//               </Select>
//             </FormControl>
//           </Box>
          
//           <Box sx={{ maxHeight: '520px', overflowY: 'auto', pr: 1, '&::-webkit-scrollbar': { width: '6px' }, '&::-webkit-scrollbar-track': { background: 'transparent' }, '&::-webkit-scrollbar-thumb': { background: 'rgba(128, 128, 128, 0.3)', borderRadius: '4px' } }}>
//             {loading ? (
//               <Grid2 container spacing={2.5}>
//                 {[1, 2].map((n) => (
//                   <Grid2 key={n} size={{ xs: 12, sm: 6 }}><Skeleton variant="rounded" height={180} sx={{ borderRadius: 3 }} /></Grid2>
//                 ))}
//               </Grid2>
//             ) : (
//               // Passing the filtered array down
//               <ActivityList activities={filteredActivities} />
//             )}
//           </Box>
//         </Grid2>
//       </Grid2>
//     </Box>
//   );
// };

// export default Dashboard;

import React, { useEffect, useState, useMemo } from "react";
import { 
  Box, 
  Typography, 
  Grid2, 
  Card, 
  CardContent, 
  Tooltip as MuiTooltip, 
  Skeleton, 
  Button, 
  FormControl, 
  Select, 
  MenuItem, 
  InputLabel,
  Link 
} from "@mui/material";
import RefreshIcon from '@mui/icons-material/Refresh';
import LocalFireDepartmentIcon from '@mui/icons-material/LocalFireDepartment';
import GitHubIcon from "@mui/icons-material/GitHub";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import ActivityForm from "../components/ActivityForm";
import ActivityList from "../components/ActivityList";
import StatsCards from "../components/StatsCards";
import { getActivities } from "../services/api";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, Legend } from 'recharts';

const Dashboard = () => {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const [listTimeFrame, setListTimeFrame] = useState("all");

  const fetchActivities = async (showSkeleton = false) => {
    if (showSkeleton) setLoading(true);
    try {
      const response = await getActivities();
      const rawData = response.data || [];
      const sortedData = [...rawData].sort((a, b) => {
        if (a.createdAt && b.createdAt) return new Date(b.createdAt) - new Date(a.createdAt);
        if (a.id && b.id) return Number(b.id) - Number(a.id);
        return 0;
      });
      setActivities(sortedData);
    } catch (error) {
      console.error("Error fetching activities:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchActivities(true);
    const intervalId = setInterval(() => {
      fetchActivities(false);
    }, 30000);
    return () => clearInterval(intervalId);
  }, []);

  const handleActivityAdded = (newActivity) => {
    if (newActivity) {
      setActivities((prev) => {
        const updatedList = [newActivity, ...prev];
        return updatedList.sort((a, b) => {
          if (a.createdAt && b.createdAt) return new Date(b.createdAt) - new Date(a.createdAt);
          if (a.id && b.id) return Number(b.id) - Number(a.id);
          return 0;
        });
      });
    } else {
      fetchActivities(false);
    }
  };

  // --- Dynamic Time-Frame Filtering for Recent Activities ---
  const filteredActivities = useMemo(() => {
    const now = new Date();
    const todayStr = now.toISOString().split("T")[0];

    return activities.filter((item) => {
      if (listTimeFrame === "all") return true;
      if (!item.createdAt) return false;

      const actDate = new Date(item.createdAt);
      const actDateStr = item.createdAt.split("T")[0];

      if (listTimeFrame === "today") {
        return actDateStr === todayStr;
      }
      if (listTimeFrame === "week") {
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(now.getDate() - 7);
        return actDate >= sevenDaysAgo && actDate <= now;
      }
      if (listTimeFrame === "month") {
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(now.getDate() - 30);
        return actDate >= thirtyDaysAgo && actDate <= now;
      }
      return true;
    });
  }, [activities, listTimeFrame]);

  // --- Streak Logic ---
  const currentStreak = useMemo(() => {
    if (!activities.length) return 0;
    const sortedDates = activities
      .map(a => a.createdAt ? a.createdAt.split("T")[0] : null)
      .filter((v, i, a) => v && a.indexOf(v) === i)
      .sort((a, b) => new Date(b) - new Date(a));
    
    let streak = 0;
    let expected = new Date();
    for (let i = 0; i < sortedDates.length; i++) {
      const dStr = expected.toISOString().split('T')[0];
      if (sortedDates.includes(dStr)) {
        streak++;
        expected.setDate(expected.getDate() - 1);
      } else {
        if (i === 0) {
          expected.setDate(expected.getDate() - 1);
          const yesterdayStr = expected.toISOString().split('T')[0];
          if (sortedDates.includes(yesterdayStr)) continue;
        }
        break;
      }
    }
    return streak;
  }, [activities]);

  // --- Heatmap Data Logic ---
  const heatmapData = useMemo(() => {
    const activityMap = {};
    let maxCaloriesFound = 0;
    activities.forEach(act => {
      if (!act.createdAt) return;
      const dateStr = act.createdAt.split("T")[0];
      const cals = Number(act.caloriesBurned) || 0;
      if (!activityMap[dateStr]) activityMap[dateStr] = { count: 0, totalCalories: 0 };
      activityMap[dateStr].count += 1;
      activityMap[dateStr].totalCalories += cals;
      if (activityMap[dateStr].totalCalories > maxCaloriesFound) maxCaloriesFound = activityMap[dateStr].totalCalories;
    });
    const last7Days = Array.from({ length: 7 }).map((_, i) => {
      const d = new Date();
      d.setDate(d.getDate() - i);
      return d.toISOString().split('T')[0];
    }).reverse();
    return last7Days.map(dateStr => {
      const dataForDay = activityMap[dateStr] || { count: 0, totalCalories: 0 };
      let backgroundColor = "rgba(128, 128, 128, 0.15)";
      if (dataForDay.totalCalories > 0 && maxCaloriesFound > 0) {
        const ratio = dataForDay.totalCalories / maxCaloriesFound;
        backgroundColor = `rgba(21, 101, 192, ${Math.max(ratio, 0.25)})`;
      }
      return {
        dateLabel: new Date(dateStr).toLocaleDateString('en-US', { weekday: 'short', day: 'numeric' }),
        color: backgroundColor,
        count: dataForDay.count,
        calories: dataForDay.totalCalories
      };
    });
  }, [activities]);

  // --- Chart Data Logic ---
  const chartData = useMemo(() => {
    const activityMap = {};
    activities.forEach(act => {
      if (!act.createdAt) return;
      const dateStr = act.createdAt.split("T")[0];
      if (!activityMap[dateStr]) activityMap[dateStr] = { calories: 0, duration: 0 };
      activityMap[dateStr].calories += Number(act.caloriesBurned) || 0;
      activityMap[dateStr].duration += Number(act.duration) || 0;
    });
    const last7Days = Array.from({ length: 7 }).map((_, i) => {
      const d = new Date();
      d.setDate(d.getDate() - i);
      return d.toISOString().split('T')[0];
    }).reverse();
    return last7Days.map(dateStr => {
      const dayData = activityMap[dateStr] || { calories: 0, duration: 0 };
      return {
        day: new Date(dateStr).toLocaleDateString('en-US', { weekday: 'short', day: 'numeric' }),
        Calories: dayData.calories,
        Duration: dayData.duration
      };
    });
  }, [activities]);

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Box sx={{ flexGrow: 1 }}>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
          <Typography variant="h4" fontWeight="800">Welcome Back 👋</Typography>
          <Button 
            variant="outlined" 
            size="small"
            startIcon={<RefreshIcon />}
            onClick={() => fetchActivities(true)}
            sx={{ textTransform: 'none', borderRadius: 2 }}
          >
            Refresh
          </Button>
        </Box>
        
        <Typography color="text.secondary" mb={4}>
          Track your workouts and monitor your daily progress.
        </Typography>

        <StatsCards activities={activities} />

        <Grid2 container spacing={4} sx={{ mt: 2 }}>
          {/* LEFT COLUMN */}
          <Grid2 size={{ xs: 12, md: 4 }}>
            <Card sx={{ mb: 3, borderRadius: 3, border: "1px solid", borderColor: "divider", background: "linear-gradient(135deg, rgba(239, 68, 68, 0.1), transparent)" }} elevation={0}>
              <CardContent sx={{ display: 'flex', alignItems: 'center', gap: 2, py: 2 }}>
                <Box sx={{ width: 50, height: 50, borderRadius: '50%', bgcolor: 'rgba(239, 68, 68, 0.15)', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                  <LocalFireDepartmentIcon sx={{ color: '#ef4444', fontSize: 32 }} />
                </Box>
                <Box>
                  <Typography variant="h5" fontWeight="900" sx={{ lineHeight: 1.1 }}>{currentStreak} Days</Typography>
                  <Typography variant="caption" color="text.secondary" fontWeight="bold">CURRENT WORKOUT STREAK</Typography>
                </Box>
              </CardContent>
            </Card>

            <ActivityForm onActivityAdded={handleActivityAdded} />
            
            <Card sx={{ mt: 3, borderRadius: 3, border: "1px solid", borderColor: "divider" }} elevation={0}>
              <CardContent>
                <Typography variant="subtitle2" fontWeight="bold" mb={2}>Activity Heatmap (Last 7 Days)</Typography>
                <Box display="flex" gap={1.2} justifyContent="start" py={0.5} flexWrap="wrap">
                  {heatmapData.map((day, idx) => (
                    <MuiTooltip key={idx} title={`${day.dateLabel}: ${day.count} workouts (${day.calories} kcal)`} arrow>
                      <Box sx={{ width: 32, height: 32, borderRadius: 1, backgroundColor: day.color, cursor: 'pointer', transition: '.2s', '&:hover': { transform: 'scale(1.15)' } }} />
                    </MuiTooltip>
                  ))}
                </Box>
              </CardContent>
            </Card>
          </Grid2>
          
          {/* RIGHT COLUMN */}
          <Grid2 size={{ xs: 12, md: 8 }}>
            <Card sx={{ mb: 4, borderRadius: 3, border: "1px solid", borderColor: "divider" }} elevation={0}>
              <CardContent>
                <Typography variant="subtitle2" fontWeight="bold" mb={2}>Calories vs Duration Analysis</Typography>
                <Box sx={{ width: '100%', height: 210 }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={chartData}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(128,128,128,0.1)"/>
                      <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fontSize: 11 }} />
                      <YAxis yAxisId="left" orientation="left" axisLine={false} tickLine={false} tick={{ fontSize: 10 }} />
                      <YAxis yAxisId="right" orientation="right" axisLine={false} tickLine={false} tick={{ fontSize: 10 }} />
                      <Tooltip cursor={{ fill: 'rgba(0,0,0,0.02)' }} />
                      <Legend verticalAlign="top" height={36} iconType="circle"/>
                      <Bar yAxisId="left" name="Calories (kcal)" dataKey="Calories" fill="#1565C0" radius={[4, 4, 0, 0]} />
                      <Bar yAxisId="right" name="Duration (min)" dataKey="Duration" fill="#10b981" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </Box>
              </CardContent>
            </Card>

            {/* List Header Container with Dynamic Filter Dropdown */}
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
              <Typography variant="h5" fontWeight="bold">Recent Activities</Typography>
              
              <FormControl size="small" sx={{ minWidth: 150 }}>
                <InputLabel id="list-filter-label">Filter Activities</InputLabel>
                <Select
                  labelId="list-filter-label"
                  value={listTimeFrame}
                  label="Filter Activities"
                  onChange={(e) => setListTimeFrame(e.target.value)}
                  sx={{ borderRadius: 2 }}
                >
                  <MenuItem value="all">🌍 All History</MenuItem>
                  <MenuItem value="today">📅 Today</MenuItem>
                  <MenuItem value="week">🗓️ This Week</MenuItem>
                  <MenuItem value="month">📊 This Month</MenuItem>
                </Select>
              </FormControl>
            </Box>
            
            <Box sx={{ maxHeight: '520px', overflowY: 'auto', pr: 1, '&::-webkit-scrollbar': { width: '6px' }, '&::-webkit-scrollbar-track': { background: 'transparent' }, '&::-webkit-scrollbar-thumb': { background: 'rgba(128, 128, 128, 0.3)', borderRadius: '4px' } }}>
              {loading ? (
                <Grid2 container spacing={2.5}>
                  {[1, 2].map((n) => (
                    <Grid2 key={n} size={{ xs: 12, sm: 6 }}><Skeleton variant="rounded" height={180} sx={{ borderRadius: 3 }} /></Grid2>
                  ))}
                </Grid2>
              ) : (
                <ActivityList activities={filteredActivities} />
              )}
            </Box>
          </Grid2>
        </Grid2>
      </Box>

      {/* --- FOOTER SECTION --- */}
      <Box 
        component="footer" 
        sx={{ 
          mt: 8, 
          py: 3, 
          borderTop: '1px solid', 
          borderColor: 'divider', 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: 2
        }}
      >
        <Typography variant="body2" color="text.secondary">
          © {new Date().getFullYear()} Fitness Dashboard. All rights reserved.
        </Typography>
        <Box display="flex" gap={2}>
          <Link href="https://github.com/om22-pandey" target="_blank" rel="noopener" color="inherit" sx={{ display: 'flex', alignItems: 'center', '&:hover': { color: 'primary.main' } }}>
            <GitHubIcon sx={{ mr: 0.5, fontSize: 20 }} /> GitHub
          </Link>
          <Link href="https://www.linkedin.com/in/om-pandey-2021aa285/" target="_blank" rel="noopener" color="inherit" sx={{ display: 'flex', alignItems: 'center', '&:hover': { color: 'primary.main' } }}>
            <LinkedInIcon sx={{ mr: 0.5, fontSize: 20 }} /> LinkedIn
          </Link>
        </Box>
      </Box>
    </Box>
  );
};

export default Dashboard;