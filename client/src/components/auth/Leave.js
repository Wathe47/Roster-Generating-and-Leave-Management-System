import React from 'react';
import { TextField, Button, Select, MenuItem, FormControl, InputLabel } from '@mui/material';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

class Leave extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      name: '',
      startDate: '',
      endDate: '',
      duration: '',
      priority: '',
      comments: '',
    };
  }

  handleSubmit = (event) => {
    event.preventDefault();
    console.log('Form submitted:', this.state);
  };

  handleInputChange = (event) => {
    const target = event.target;
    const name = target.name;
    const value = target.type === 'checkbox' ? target.checked : target.value;

    this.setState({
      [name]: value,
    });
  };

  render() {
    return (
      <motion.div
        initial={{ opacity: 0, y: '1%' }}
        animate={{ opacity: 1, y: '0%' }}
        transition={{ duration: 0.75, ease: 'easeOut' }}
        className={this.props.mode}
      >
                <h1 style={{marginLeft:'20%',fontSize:'30px',fontfamily: 'Roboto',  color:'rgb(89, 88, 88)'
}}>LEAVE REQUEST FORM</h1>

        <div className="leave">

          <form onSubmit={this.handleSubmit}>
            <TextField
              label="Name"
              variant="outlined"
              name="name"
              value={this.state.name}
              onChange={this.handleInputChange}
              fullWidth
              margin="normal"
            />
            <TextField
              label="Start Date"
              type="date"
              variant="outlined"
              name="startDate"
              value={this.state.startDate}
              onChange={this.handleInputChange}
              fullWidth
              margin="normal"
              InputLabelProps={{
                shrink: true,
              }}
            />
            <TextField
              label="End Date"
              type="date"
              variant="outlined"
              name="endDate"
              value={this.state.endDate}
              onChange={this.handleInputChange}
              fullWidth
              margin="normal"
              InputLabelProps={{
                shrink: true,
              }}
            />
            <FormControl fullWidth margin="normal">
              <InputLabel id="duration-select-label">Duration</InputLabel>
              <Select
                labelId="duration-select-label"
                id="duration-select"
                name="duration"
                value={this.state.duration}
                onChange={this.handleInputChange}
              >
                <MenuItem value="half-day">Half Day</MenuItem>
                <MenuItem value="full-day">Full Day</MenuItem>
              </Select>
            </FormControl>
            <FormControl fullWidth margin="normal">
              <InputLabel id="priority-select-label">Priority</InputLabel>
              <Select
                labelId="priority-select-label"
                id="priority-select"
                name="priority"
                value={this.state.priority}
                onChange={this.handleInputChange}
              >
                <MenuItem value="critical">Critical</MenuItem>
                <MenuItem value="medium">Medium</MenuItem>
              </Select>
            </FormControl>
            <TextField
              label="Comments"
              variant="outlined"
              name="comments"
              value={this.state.comments}
              onChange={this.handleInputChange}
              fullWidth
              margin="normal"
            />
           
          </form>

          
        </div>
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '1rem', marginRight: '20%' }}>
        <Button type="submit" variant="contained" color="success" style={{marginRight:'10px'}}>
              Request
            </Button>
            <Link to="/dashboard" className='leaveclosebutton'>
            <Button variant="outlined" >
              Close
            </Button>
            
          </Link>
          </div>

          <div className="leave">
          <form>
          <TextField
            label="Pending Requests"
            variant="outlined"
            value={10}
            margin="normal"
            style={{ marginRight: '1rem' }}
            />
            <TextField
             label="Approved Requests"
             variant="outlined"
             value={5}
             margin="normal"
           />
           </form>
           </div>
           
        
          
          
          
      </motion.div>
    );
  }
}

export default Leave;
