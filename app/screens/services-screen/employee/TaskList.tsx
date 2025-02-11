import React, { useEffect, useState, useRef, useCallback } from "react";
import {
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Animated,
  PanResponder,
  RefreshControl,
} from "react-native";
import { Text, TextInput } from "react-native-paper";
import Modalize from "react-native-modalize";
import EmployeeServices from "../../services/EmployeeServices";
import Toast from "react-native-toast-message";
import { colors } from "../../../styles/colors";
import { buttonStyles } from "../../../styles/styles";
import { Task } from "../../models/task-model";
import * as SecureStore from "expo-secure-store";
import CardTask from "../../components/CardTask";
import { useFocusEffect } from "@react-navigation/native";

interface Meta {
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  page: number;
  pageCount: number;
  take: number;
  totalCount: number;
}

const TaskList: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [meta, setMeta] = useState<Meta | null>(null);
  const [comment, setComment] = useState<string>("");
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [isLoadingMore, setIsLoadingMore] = useState<boolean>(false);
  const [userId, setUserId] = useState<number>(0);
  const [refreshing, setRefreshing] = useState<boolean>(false);

  const confirmModalRef = useRef<Modalize>(null);
  const commentModalRef = useRef<Modalize>(null);
  const panRefs = useRef(new Map());

  const openConfirmModal = (task: Task) => {
    setSelectedTask(task);
    confirmModalRef.current?.open();
  };

  const openDenyModal = (task: Task) => {
    setSelectedTask(task);
    commentModalRef.current?.open();
  };

  const handleConfirm = async () => {
    if (!selectedTask) return;

    const res = await EmployeeServices.acceptTask(selectedTask);
    console.log(res);
    confirmModalRef.current?.close();
    Toast.show({
      text1: "La tarea se tomó, gracias por confirmar",
      text2: "Se te asignó la tarea.",
    });
  };

  const handleDeny = async () => {
    if (!selectedTask) return;

    if (!comment.trim()) {
      Toast.show({
        type: "error",
        text1: "Comentario vacío",
        text2: "Escribe algo antes de enviar",
      });
      return;
    }

    const res = await EmployeeServices.denyTask(selectedTask, comment);
    console.log(res);
    commentModalRef.current?.close();
    setComment("");
    Toast.show({
      text1: "La tarea fue denegada",
      text2: "Tu comentario ha sido enviado.",
    });
  };

  const getTaskList = async (page: number) => {
    if (userId == 0) {
      const storedUserId = await SecureStore.getItemAsync("userId");
      if (!storedUserId) return;
      setUserId(Number(storedUserId));
    }

    try {
      setLoading(true);
      const res = await EmployeeServices.getTaskList(
        userId || Number(await SecureStore.getItemAsync("userId")),
        page
      );
      setTasks((prevTasks) => (page === 1 ? res.data : [...prevTasks, ...res.data]));
      setMeta(res.meta);
    } finally {
      setLoading(false);
      setIsLoadingMore(false);
      setRefreshing(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      getTaskList(1);
    }, [])
  );

  useEffect(() => {
    getTaskList(currentPage);
  }, [currentPage]);

  const onRefresh = () => {
    setRefreshing(true);
    setCurrentPage(1);
    getTaskList(1);
  };

  const toggleExpand = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
  };

  const handleScroll = (event: any) => {
    const { layoutMeasurement, contentOffset, contentSize } = event.nativeEvent;
    const paddingToBottom = 20;
    if (
      layoutMeasurement.height + contentOffset.y >=
      contentSize.height - paddingToBottom
    ) {
      if (meta?.hasNextPage && !isLoadingMore) {
        setIsLoadingMore(true);
        setCurrentPage((prevPage) => prevPage + 1);
      }
    }
  };

  if (loading && tasks.length === 0) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
        <Text>Cargando tareas...</Text>
      </View>
    );
  }

  return (
    <View style={styles.mainContainer}>
      <ScrollView
        contentContainerStyle={styles.container}
        onScroll={handleScroll}
        scrollEventThrottle={16}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {tasks.map((task) => {
          if (!panRefs.current.has(task.id)) {
            panRefs.current.set(task.id, new Animated.ValueXY());
          }
          const pan = panRefs.current.get(task.id);

          const panResponder = PanResponder.create({
            onMoveShouldSetPanResponder: () => true,
            onPanResponderMove: (_, gesture) => {
              pan.setValue({ x: gesture.dx, y: 0 });
            },
            onPanResponderRelease: (_, gesture) => {
              if (gesture.dx > 50) {
                // Deslizar hacia la derecha
                openConfirmModal(task);
              } else if (gesture.dx < -50) {
                // Deslizar hacia la izquierda
                openDenyModal(task);
              }
              Animated.spring(pan, {
                toValue: { x: 0, y: 0 },
                useNativeDriver: true,
              }).start();
            },
          });

          return (
            <Animated.View
              key={task.id}
              {...panResponder.panHandlers}
              style={{ transform: [{ translateX: pan.x }] }}
            >
              <CardTask
                key={task.id}
                task={task}
                expandedId={expandedId}
                onPress={setExpandedId}
              />
            </Animated.View>
          );
        })}
        <View style={{ height: 20 }}></View>
        {isLoadingMore && <ActivityIndicator size="small" color="#0000ff" />}
        {!meta?.hasNextPage && tasks.length > 0 && (
          <Text style={styles.noMoreText}>No hay más tareas para cargar</Text>
        )}
      </ScrollView>

      <Modalize ref={confirmModalRef} adjustToContentHeight>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>Confirmar Tarea</Text>
          <Text style={styles.modalText}>
            ¿Estás seguro de que deseas confirmar esta tarea?
          </Text>
          <TouchableOpacity onPress={handleConfirm} style={buttonStyles.button}>
            <Text style={buttonStyles.buttonText}>Confirmar</Text>
          </TouchableOpacity>
        </View>
      </Modalize>

      <Modalize ref={commentModalRef} adjustToContentHeight>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>Agregar Comentario</Text>
          <Text style={styles.modalText}>
            Necesitamos saber por qué deniegas la tarea
          </Text>
          <TextInput
            mode="outlined"
            multiline
            numberOfLines={4}
            placeholder="Escribe tu comentario aquí..."
            value={comment}
            onChangeText={setComment}
            style={styles.textArea}
          />
          <TouchableOpacity onPress={handleDeny} style={buttonStyles.button}>
            <Text style={buttonStyles.buttonText}>Confirmar</Text>
          </TouchableOpacity>
        </View>
      </Modalize>
    </View>
  );
};

export default TaskList;

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: colors.light,
  },
  container: {
    flexGrow: 1,
    paddingVertical: 8,
    paddingBottom: 80,
  },
  card: {
    padding: 10,
    borderRadius: 0,
    backgroundColor: "#FFFFFF",
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  squareAvatar: {
    backgroundColor: "#E0E0E0",
    borderRadius: "50%",
  },
  textContainer: {
    flex: 1,
    marginHorizontal: 10,
  },
  title: {
    fontSize: 16,
    fontWeight: "bold",
  },
  description: {
    fontSize: 14,
    color: "#666",
  },
  content: {
    marginTop: 10,
    padding: 10,
    backgroundColor: colors.light,
    borderTopWidth: 0.5,
    borderTopColor: colors.dark,
  },
  loadingContainer: {
    flex: 1,
    paddingVertical: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    padding: 20,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 16,
    textAlign: "center",
  },
  modalText: {
    fontSize: 16,
    marginBottom: 16,
    textAlign: "center",
  },
  textArea: {
    marginBottom: 16,
    paddingVertical: 10,
  },
  noMoreText: {
    textAlign: "center",
    marginVertical: 16,
    color: "#666",
  },
});