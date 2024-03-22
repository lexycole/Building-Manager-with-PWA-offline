import React from "react";

import { Card, Text } from "react-native-elements";
import styles from "./styles";

const DashboardCard = (props) => {
  return (
    <Card
      containerStyle={[styles.container, { backgroundColor: props.backColor }]}
    >
      <Card.Title>{props.title}</Card.Title>

      <Card.Divider />

      <Text>{props.text}</Text>
    </Card>
  );
};

export default DashboardCard;
