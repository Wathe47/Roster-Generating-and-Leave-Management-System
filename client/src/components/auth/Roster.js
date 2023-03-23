import React, { Component } from "react";
import { motion } from "framer-motion";

class About extends Component {
  render() {
    return (
      <motion.div
        initial={{ opacity: 0, y: "1%" }}
        animate={{ opacity: 1, y: "0%" }}
        transition={{ duration: 0.75, ease: "easeOut" }}
        className={this.props.mode}
      >
      <div>Roster</div>


 </motion.div>
    );
  }
}

export default About;
 