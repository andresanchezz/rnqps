import React, { useEffect, useState, useRef } from "react";
import { View, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator, Animated, PanResponder, Image, Alert } from "react-native";
import { Card, Text, Avatar, TextInput } from "react-native-paper";
import Modalize from "react-native-modalize";
import { TabView, SceneMap, TabBar } from 'react-native-tab-view';
import * as ImagePicker from 'expo-image-picker'; // Para abrir la galería
import EmployeeServices from "../../services/EmployeeServices";
import Toast from "react-native-toast-message";
import { colors } from "../../../styles/colors";
import { buttonStyles } from "../../../styles/styles";
import { Task } from '../../models/task-model';

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
    const [selectedTask, setSelectedTask] = useState<Task | null>(null);
    const [isLoadingMore, setIsLoadingMore] = useState<boolean>(false);
    const [index, setIndex] = useState(0);
    const [routes] = useState([
        { key: 'pending', title: 'Pendientes' },
        { key: 'rejected', title: 'Rechazadas' },
    ]);
    const [selectedImages, setSelectedImages] = useState<string[]>([]); // Almacena las fotos seleccionadas

    const commentModalRef = useRef<Modalize>(null);

    // Función para abrir el modal de fotos
    const openPicturesModal = (task: Task) => {
        setSelectedTask(task);
        setSelectedImages([]); // Limpiar las imágenes seleccionadas al abrir el modal
        commentModalRef.current?.open();
    };

    // Función para abrir la galería y seleccionar imágenes
    const handleAddPhoto = async () => {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== "granted") {
            Alert.alert("Se necesitan permisos para acceder a la galería.");
            return;
        }

        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsMultipleSelection: true, // Permite seleccionar varias imágenes
            quality: 1, // Calidad máxima
        });

        if (!result.canceled) {
            // Agrega las nuevas imágenes al estado
            setSelectedImages((prevImages) => [
                ...prevImages,
                ...result.assets.map((asset) => asset.uri),
            ]);
        }
    };

    // Función para eliminar una imagen
    const handleRemoveImage = (uri: string) => {
        setSelectedImages((prevImages) => prevImages.filter((image) => image !== uri));
    };

    // Función para manejar la confirmación de fotos
    const handlePictures = async () => {
        if (!selectedTask) return;

        if (selectedImages.length === 0) {
            Toast.show({
                type: 'error',
                text1: 'No hay fotos seleccionadas',
                text2: 'Por favor, selecciona al menos una foto.'
            });
            return;
        }

        // Aquí puedes enviar las fotos al servidor o manejarlas como necesites
        console.log("Fotos seleccionadas:", selectedImages);
        Toast.show({
            text1: "Fotos confirmadas",
            text2: "Las fotos se han subido correctamente.",
        });
        commentModalRef.current?.close();
    };

    const getTaskList = async (page: number) => {
        try {
            setLoading(true);
            const res = await EmployeeServices.getTaskList(2, page);
            setTasks(prevTasks => [...prevTasks, ...res.data]);
            setMeta(res.meta);
        } finally {
            setLoading(false);
            setIsLoadingMore(false);
        }
    };

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

    const renderScene = SceneMap({
        pending: () => (
            <ScrollView contentContainerStyle={styles.container} onScroll={handleScroll} scrollEventThrottle={16}>
                {tasks.filter(task => task.statusId === "3").map((task) => (
                    <TaskCard key={task.id} task={task} expandedId={expandedId} toggleExpand={toggleExpand} openPicturesModal={openPicturesModal} />
                ))}
                <View style={{ height: 20 }}></View>
                {isLoadingMore && <ActivityIndicator size="small" color="#0000ff" />}
                {!meta?.hasNextPage && tasks.length > 0 && <Text style={styles.noMoreText}>No hay más tareas para cargar</Text>}
            </ScrollView>
        ),
        rejected: () => (
            <ScrollView contentContainerStyle={styles.container} onScroll={handleScroll} scrollEventThrottle={16}>
                {tasks.filter(task => task.statusId === "4").map((task) => (
                    <TaskCard key={task.id} task={task} expandedId={expandedId} toggleExpand={toggleExpand} />
                ))}
                <View style={{ height: 20 }}></View>
                {isLoadingMore && <ActivityIndicator size="small" color="#0000ff" />}
                {!meta?.hasNextPage && tasks.length > 0 && <Text style={styles.noMoreText}>No hay más tareas para cargar</Text>}
            </ScrollView>
        ),
    });

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
            <TabView
                navigationState={{ index, routes }}
                renderScene={renderScene}
                onIndexChange={setIndex}
                renderTabBar={props => (
                    <TabBar
                        {...props}
                        style={{ backgroundColor: colors.primary }}
                        indicatorStyle={{ backgroundColor: colors.primary }}
                    />
                )}
            />

            {/* Modal para agregar fotos */}
            <Modalize ref={commentModalRef} adjustToContentHeight>
                <View style={styles.modalContent}>
                    <Text style={styles.modalTitle}>Agregar Evidencia</Text>
                    <Text style={styles.modalText}>Necesitamos que subas fotos del trabajo terminado</Text>

                    {/* Contenedor de la galería de fotos */}
                    <ScrollView horizontal style={styles.galleryContainer}>
                        {/* Botón para agregar fotos */}
                        <TouchableOpacity onPress={handleAddPhoto} style={styles.addPhotoButton}>
                            <Text style={styles.addPhotoText}>+</Text>
                        </TouchableOpacity>

                        {/* Mostrar las imágenes seleccionadas */}
                        {selectedImages.map((uri, index) => (
                            <TouchableOpacity
                                key={index}
                                onPress={() => handleRemoveImage(uri)}
                                style={styles.imageContainer}
                            >
                                <Image source={{ uri }} style={styles.image} />
                            </TouchableOpacity>
                        ))}
                    </ScrollView>

                    {/* Botón de confirmar */}
                    <TouchableOpacity onPress={handlePictures} style={buttonStyles.button}>
                        <Text style={buttonStyles.buttonText}>Confirmar</Text>
                    </TouchableOpacity>
                </View>
            </Modalize>
        </View>
    );
};

const TaskCard: React.FC<{ task: Task, expandedId: string | null, toggleExpand: (id: string) => void, openPicturesModal?: (task: Task) => void }> = ({ task, expandedId, toggleExpand, openPicturesModal }) => {
    const pan = useRef(new Animated.ValueXY()).current;

    const panResponder = PanResponder.create({
        onMoveShouldSetPanResponder: () => task.statusId === "3", // Solo permitir deslizar si es una tarea pendiente
        onPanResponderMove: (_, gesture) => {
            if (task.statusId === "3" && gesture.dx > 0) { // Solo permitir movimiento hacia la derecha
                pan.setValue({ x: gesture.dx, y: 0 });
            }
        },
        onPanResponderRelease: (_, gesture) => {
            if (task.statusId === "3" && gesture.dx > 100 && openPicturesModal) { // Solo abrir el modal si se desliza hacia la derecha
                openPicturesModal(task);
            }
            Animated.spring(pan, {
                toValue: { x: 0, y: 0 },
                useNativeDriver: true,
            }).start();
        },
    });

    return (
        <Animated.View
            {...(task.statusId === "3" ? panResponder.panHandlers : {})} // Solo aplicar panHandlers si es una tarea pendiente
            style={[{ transform: [{ translateX: pan.x }] }]}
        >
            <Card style={styles.card}>
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
        </Animated.View>
    );
};

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
        borderTopWidth: .5,
        borderTopColor: colors.dark
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
    galleryContainer: {
        flexDirection: "row",
        marginBottom: 20,
    },
    addPhotoButton: {
        width: 100,
        height: 100,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#E0E0E0",
        borderRadius: 10,
        marginRight: 10,
    },
    addPhotoText: {
        fontSize: 24,
        color: "#666",
    },
    imageContainer: {
        width: 100,
        height: 100,
        marginRight: 10,
        borderRadius: 10,
        overflow: "hidden",
    },
    image: {
        width: "100%",
        height: "100%",
    },
    noMoreText: {
        textAlign: "center",
        marginVertical: 16,
        color: "#666",
    },
});

export default TaskList;