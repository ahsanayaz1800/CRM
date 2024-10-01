import { useEffect, useState,  } from "react";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { getCounts , getUsersByMonth, getCustomersByMonth} from "../../http";
import { setCount } from "../../store/main-slice";
import CountsCard from './CountsCard';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
} from 'recharts';
import '../../assets/css/adminDashboard.css';

const Admin = () =>
{
  const dispatch = useDispatch();
  useEffect(()=>{
    (async ()=>
    {
      const res = await getCounts();
      if(res.success)
        dispatch(setCount(res.data));
    })();
  },[])

  const {counts}  = useSelector((state)=>state.mainSlice);
  const {admin,employee,leader,team} = counts;
  const [userByMonth, setUserByMonth]= useState()
  const [customerByMonth, setCustomerByMonth]= useState()
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await getUsersByMonth();
        if (response.success) {
          setUserByMonth(response.data); // Set data for chart
          console.log(userByMonth)
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };
  
    fetchUserData();
    const fetchCustomerData = async () => {
      try {
        const response = await getCustomersByMonth();
        if (response.success) {
          setCustomerByMonth(response.data); // Set data for chart
          console.log(userByMonth)
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };
  
    fetchCustomerData();
  }, []);
  


  const deviceData = [
    { device: 'Linux', users: 10000 },
    { device: 'Mac', users: 15000 },
    { device: 'iOS', users: 20000 },
    { device: 'Windows', users: 25000 },
    { device: 'Android', users: 18000 },
    { device: 'Other', users: 12000 },
  ];

  const locationData = [
    { name: 'United States', value: 3860 },
    { name: 'Canada', value: 2250 },
    { name: 'Mexico', value: 3080 },
    { name: 'Other', value: 810 },
  ];

  const trafficData = [
    { name: 'Google', value: 4000 },
    { name: 'YouTube', value: 3000 },
    { name: 'Instagram', value: 2000 },
    { name: 'Pinterest', value: 1500 },
    { name: 'Facebook', value: 1000 },
    { name: 'Twitter', value: 500 },
  ];


    return(
         <div>
            <div className="row">
                <CountsCard title='Total Employee' icon='fa-user' count={employee}/>
                <CountsCard title='Total Leader' icon='fa-user' count={leader}/>
                <CountsCard title='Total Admin' icon='fa-user' count={admin}/>
                <CountsCard title='Total Team' icon='fa-user' count={team}/>
            </div>
            <div className="summary-cards">
        <div className="admin-card">Projects: 72 <span className="trend">(+11.02%)</span></div>
        <div className="admin-card">Leads: 3,671 <span className="trend">(-0.03%)</span></div>
        <div className="admin-card">Customers: 156 <span className="trend">(+15.03%)</span></div>
        <div className="admin-card">Lead Sources: 31 <span className="trend">(+6.08%)</span></div>
      </div>

      <section className="charts">
        <div className="row">
          <div className="col-9">
          <h2>Total Users</h2>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={userByMonth}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Line type="monotone" dataKey="users" stroke="#8884d8" />
          </LineChart>
        </ResponsiveContainer>

          </div>

        </div>
        
      </section>
      <section className="traffic">


        <div className="row">



    <div className="col-6">
        <h2>Total Customers</h2>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={customerByMonth}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="customers" fill="#82ca9d" />
          </BarChart>
        </ResponsiveContainer>
      
    </div>
    <div className="col-6">
        <h2>Traffic by Location</h2>
        <ResponsiveContainer width="100%" height={300} className="d-flex align-items-center">
          
            <PieChart>
              <Pie data={locationData} dataKey="value" nameKey="name" outerRadius={100} fill="#8884d8">
                {locationData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={['#0088FE', '#00C49F', '#FFBB28', '#FF8042'][index]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>

        
            {/* Legend */}
            <div className="location-legend">
            {locationData.map((location, index) => (
              <div key={index} className="location-item">
                <div
                  className="color-box"
                  style={{ backgroundColor: COLORS[index % COLORS.length] }}
                ></div>
                <span className="location-name">{location.name}</span>
                <span className="location-value">{location.value}</span>
              </div>
            ))}
          </div>

        
        </ResponsiveContainer>
        

    </div>
        </div>

      </section>

      <section className="seo">
        <h2>Marketing & SEO</h2>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={trafficData}>
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="value" fill="#8884d8" />
          </BarChart>
        </ResponsiveContainer>
      </section>



         </div>
    )
}

export default Admin;

