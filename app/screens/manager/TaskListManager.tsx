import React, { useEffect, useState, useRef } from "react";
import { View, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator, Dimensions } from "react-native";
import { Card, Text, Avatar, TextInput, FAB, PaperProvider, } from "react-native-paper"; // Importa FAB
import Modalize from "react-native-modalize";
import EmployeeServices from "../../services/EmployeeServices";
import { colors } from "../../../styles/colors";
import { buttonStyles } from "../../../styles/styles";
import { Task } from '../../models/task-model';
import * as SecureStore from 'expo-secure-store';
import { Dropdown } from "react-native-paper-dropdown";
import ManagerServices from "../../services/ManagerServices";
import moment from 'moment';


interface Meta {
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  page: number;
  pageCount: number;
  take: number;
  totalCount: number;
}

const TaskListManager: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [meta, setMeta] = useState<Meta | null>(null);
  const [isLoadingMore, setIsLoadingMore] = useState<boolean>(false);
  const [managerId, setUserId] = useState<number>(0);

  const fullScreenModalRef = useRef<Modalize>(null);

  const [date, setDate] = useState(moment().format('YYYY-MM-DD'));
  const [schedule, setStartTime] = useState(moment().format('hh:mm'));
  const [comment, setComment] = useState<string>();
  
  const [unitySize, setUnitSize] = useState<string>();
  const [unitNumber, setUnitNumber] = useState<string>();
  const [communityId, setCommunity] = useState<string>();
  const [typeId, setType] = useState<string>();

  const [extraId, setExtras] = useState<string>();

  const { height } = Dimensions.get("window");


  const openFullScreenModal = () => {
    fullScreenModalRef.current?.open();
    getCommunities();
    getExtras();
    getTypesList();
  };

  const getTaskList = async (page: number) => {
    if (managerId == 0) {
      const storedUserId = await SecureStore.getItemAsync('userId');
      if (!storedUserId) return;
      setUserId(Number(storedUserId));
    }

    try {
      setLoading(true);
      const res = await EmployeeServices.getTaskList(managerId || Number(await SecureStore.getItemAsync('userId')), page);
      setTasks(prevTasks => [...prevTasks, ...res.data]);
      setMeta(res.meta);
    } finally {
      setLoading(false);
      setIsLoadingMore(false);
    }
  };

  const [cleaningTypes, setCleaningTypes] = useState<{ label: string; value: string, description:string }[]>([]);

  const getTypesList = async () => {
    const res = await ManagerServices.getServicesTypes();
    const mappedCleaningTypes = res.data.map((type: any) => ({
      label: type.cleaningType,
      value: type.id.toString(),
      description: type.description
    }));
    setCleaningTypes(mappedCleaningTypes);
  };

  const [communities, setCommunities] = useState<{ label: string; value: string }[]>([]);

  const getCommunities = async () => {
    if (managerId == 0) {
      const storedUserId = await SecureStore.getItemAsync('userId');
      if (!storedUserId) return;
      setUserId(Number(storedUserId));
    }

    const res = await ManagerServices.getManagerCommunities(String(managerId));
    const mappedCommunities = res.map((community: any) => ({
      label: community.communityName,
      value: community.id.toString(),
    }));
    setCommunities(mappedCommunities);
  };

  const [extrasList, setExtrasList] = useState<{ label: string; value: string }[]>([]);

  const getExtras = async () => {
    const res = await ManagerServices.getExtras();
    const mappedExtras = res.data.map((extra: any) => ({
      label: extra.item,
      value: extra.id.toString(),
    }));
    setExtrasList(mappedExtras);
  };

  const addNewService = async () => {

    const newService = {
      unitySize,
      date,
      schedule,
      unitNumber,
      typeId,
      extraId,
      comment,
      communityId,
      statusId: '1'
    }


    await ManagerServices.addNewService(
      newService
    ); 

    fullScreenModalRef.current?.close()

  }

  useEffect(() => {
    getTaskList(currentPage);
  }, [currentPage]);


  const toggleExpand = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
  };

  const handleScroll = (event: any) => {
    const { layoutMeasurement, contentOffset, contentSize } = event.nativeEvent;
    const paddingToBottom = 20;
    if (layoutMeasurement.height + contentOffset.y >= contentSize.height - paddingToBottom) {
      if (meta?.hasNextPage && !isLoadingMore) {
        setIsLoadingMore(true);
        setCurrentPage(prevPage => prevPage + 1);
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
      <ScrollView contentContainerStyle={styles.container} onScroll={handleScroll} scrollEventThrottle={16}>
        {tasks.map((task) => (
          <Card key={task.id} style={styles.card}>
            <TouchableOpacity onPress={() => toggleExpand(task.id)} activeOpacity={0.8}>
              <View style={styles.row}>
                <Avatar.Icon size={40} icon="file" style={styles.squareAvatar} />
                <View style={styles.textContainer}>
                  <Text style={styles.title}>Tarea #{task.id}</Text>
                  <Text style={styles.description}>Unidad: {task.unitNumber}</Text>
                  <Text style={styles.description}>Tamaño: {task.unitySize}</Text>
                </View>
              </View>
            </TouchableOpacity>
            {expandedId === task.id && (
              <View style={styles.content}>
                <Text>Detalles de la tarea {task.id}</Text>
                <Text>Comentario: {task.comment || "N/A"}</Text>
                <Text>Horario: {task.schedule || "N/A"}</Text>
                <Text>Comunidad: {task.communityId}</Text>
                <Text>Tipo: {task.typeId}</Text>
                <Text>Estado: {task.statusId}</Text>
                <Text>Usuario: {task.userId}</Text>
              </View>
            )}
          </Card>
        ))}
        <View style={{ height: 20 }}></View>
        {isLoadingMore && <ActivityIndicator size="small" color="#0000ff" />}
        {!meta?.hasNextPage && tasks.length > 0 && <Text style={styles.noMoreText}>No hay más tareas para cargar</Text>}
      </ScrollView>

      {/* Botón flotante (FAB) */}
      <FAB
        style={styles.fab}
        icon="plus"
        color={colors.light}
        onPress={openFullScreenModal}
      />



      <Modalize ref={fullScreenModalRef} height={height * 1}>
        <PaperProvider>
          <View style={styles.fullScreenModalContent}>
            <Text style={styles.modalTitle}>Create new task</Text>

            <ScrollView>
              <Dropdown
                mode="outlined"
                label="Unit size"
                placeholder="Select unit size"
                options={[
                  { label: "1 Bedroom", value: "1 Bedroom" },
                  { label: "2 Bedroom", value: "2 Bedroom" },
                  { label: "3 Bedroom", value: "3 Bedroom" },
                  { label: "4 Bedroom", value: "4 Bedroom" },
                  { label: "5 Bedroom", value: "5 Bedroom" },
                ]}
                value={unitySize}
                onSelect={(value) => setUnitSize(value)}
              />

              <TextInput
                mode="outlined"
                placeholder="Unit number"
                value={unitNumber}
                onChangeText={(text) => setUnitNumber(text)}
              />

              <Dropdown
                mode="outlined"
                label="Community"
                placeholder="Select community"
                options={communities}
                value={communityId}
                onSelect={(value) => setCommunity(value)}
              />

              <Dropdown
                mode="outlined"
                label="Type"
                placeholder="Select type"
                options={cleaningTypes.map(type => ({
                  ...type,
                  label: `${type.label} ( ${type.description} )` 
                }))}
                value={typeId}
                onSelect={(value) => setType(value)}
              />

              <Dropdown
                mode="outlined"
                label="Extras"
                placeholder="Select extras"
                options={extrasList}
                value={extraId}
                onSelect={(value) => setExtras(value)}
              />

              <TextInput
                mode="outlined"
                placeholder="Comment"
                numberOfLines={4}
                value={comment}
                onChangeText={(text) => setComment(text)}
              />
            </ScrollView>

            <View style={{ height: 10 }}></View>
            <TouchableOpacity onPress={() => addNewService()} style={buttonStyles.button}>
              <Text style={buttonStyles.buttonText}>Create</Text>
            </TouchableOpacity>
          </View>
        </PaperProvider>
      </Modalize>



    </View>
  );
};

export default TaskListManager;

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
  },
  container: {
    flexGrow: 1,
    paddingVertical: 8,
    paddingBottom: 80,
  },
  card: {
    marginVertical: 4,
    marginHorizontal: 16,
    padding: 10,
    borderRadius: 0,
    backgroundColor: "#FFFFFF",
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  squareAvatar: {
    backgroundColor: "#E0E0E0",
    borderRadius: 4,
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
  fullScreenModalContent: {
    padding: 20,
    height: '100%',
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
  button: {
    margin: 16,
    padding: 10,
    backgroundColor: colors.primary,
    borderRadius: 5,
  },
  buttonText: {
    color: "#FFFFFF",
    textAlign: "center",
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
    backgroundColor: colors.primary, // Color del FAB
  },
});