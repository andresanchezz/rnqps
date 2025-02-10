// components/AnimatedCard.tsx
import React, { useRef } from "react";
import { View, StyleSheet, TouchableOpacity, Animated, Easing } from "react-native";
import { Text, Avatar } from "react-native-paper";
import { Task } from "../models/task-model"; 

interface CardsTaskProps {
  task: Task; // Recibe una Task completa
  expandedId: string | null;
  onPress: (id: string) => void;
}

const CardTask: React.FC<CardsTaskProps> = ({
  task,
  expandedId,
  onPress,
}) => {
  const animatedHeight = useRef(new Animated.Value(0)).current;

  const isExpanded = expandedId === task.id;

  const toggleExpand = () => {
    if (isExpanded) {
      Animated.timing(animatedHeight, {
        toValue: 0,
        duration: 300,
        easing: Easing.ease,
        useNativeDriver: false,
      }).start(() => onPress(''));
    } else {
      onPress(task.id);
      Animated.timing(animatedHeight, {
        toValue: 1,
        duration: 300,
        easing: Easing.ease,
        useNativeDriver: false,
      }).start();
    }
  };

  return (
    <Animated.View
      style={[
        styles.card,
        {
          maxHeight: animatedHeight.interpolate({
            inputRange: [0, 1],
            outputRange: [100, 250], // Ajusta según el tamaño de tu tarjeta
          }),
        },
      ]}
    >
      <TouchableOpacity onPress={toggleExpand} activeOpacity={0.8}>
        <View style={styles.row}>
          <Avatar.Icon size={40} icon="file" style={styles.roundedAvatar} />
          <View style={styles.textContainer}>
            <Text style={styles.title}>Tarea #{task.id}</Text>
            <Text style={styles.description}>Unidad: {task.unitNumber}</Text>
            <Text style={styles.description}>Tamaño: {task.unitySize}</Text>
          </View>
        </View>
      </TouchableOpacity>
      {isExpanded && (
        <Animated.View
          style={[
            styles.content,
            {
              opacity: animatedHeight.interpolate({
                inputRange: [0, 1],
                outputRange: [0, 1],
              }),
            },
          ]}
        >
          <Text>Detalles de la tarea {task.id}</Text>
          <Text>Comentario: {task.comment || "N/A"}</Text>
          <Text>Horario: {task.schedule || "N/A"}</Text>
          <Text>Comunidad: {task.community?.communityName || "N/A"}</Text>
          <Text>Tipo: {task.type?.cleaningType || "N/A"}</Text>
          <Text>Estado: {task.status?.statusName || "N/A"}</Text>
          <Text>Usuario: {task.userId || "N/A"}</Text>
        </Animated.View>
      )}
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  card: {
/*     marginVertical: 4,
    marginHorizontal: 16, */
    padding: 16,
    backgroundColor: "#FFFFFF",
    borderBottomWidth: 0.5,
    borderBottomColor: "#E0E0E0",
    overflow: "hidden",
  },
  row: {
    flexDirection: "row",
  },
  roundedAvatar: {
    backgroundColor: "#E0E0E0",
    borderRadius: 20,
  },
  textContainer: {
    flex: 1,
    marginLeft: 10,
  },
  title: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#000000",
  },
  description: {
    fontSize: 14,
    color: "#666666",
    marginTop: 4,
  },
  content: {
    marginTop: 10,
    paddingTop: 10,
    borderTopWidth: 0.5,
    borderTopColor: "#E0E0E0",
  },
});

export default CardTask;