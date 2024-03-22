import React from "react";

import styles from "./styles";
import { View } from "react-native";
import DashboardCard from "../../components/Card";

const BuildingDashboard = (props) => {
  return (
    <View style={styles.container}>
      <View style={styles.dashboard}>
        <DashboardCard
          title="Current Clean"
          text={props.cleanName}
          backColor="#C1F4C5"
        />

        <DashboardCard
          title="Last Drop Clean"
          text={props.dropName}
          backColor="#F0FFC2"
        />
      </View>
    </View>
  );
};

export default BuildingDashboard;
