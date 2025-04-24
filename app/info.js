import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, Image, ActivityIndicator } from "react-native";
import { useLocalSearchParams } from "expo-router"; 
import { getMovieDetails } from "../services/api.js";
import { TouchableOpacity } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";

export default function MovieDetailsScreen() {
    const { id } = useLocalSearchParams();
    const [movie, setMovie] = useState(null);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        if (!id) {
            console.error("ID não encontrado");
            return;
        }

        const fetchMovieDetails = async () => {
            try {
                const data = await getMovieDetails(id);
                setMovie(data);
            } catch (error) {
                console.error("Erro ao buscar detalhes do filme:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchMovieDetails();
    }, [id]);

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#333" />
            </View>
        );
    }

    if (!movie) {
        return <Text style={styles.error}>Filme não encontrado</Text>;
    }

    return (
        <View style={styles.container}>
            <TouchableOpacity style={styles.back} onPress={() => router.back()}>
                <MaterialIcons name="arrow-back" size={27} color="#A458C8"></MaterialIcons> 
            </TouchableOpacity>
            <View style={styles.detailsContainer}>
                <Image
                    source={{ uri: movie.Poster !== "N/A" ? movie.Poster : "https://via.placeholder.com/100x150" }}
                    style={styles.poster}
                />
                <View style={styles.details}>
                    <Text style={styles.title}>{movie.Title}</Text>
                    <Text style={styles.year}>{movie.Year}</Text>
                    <Text style={styles.director}>Directed by {movie.Director}</Text>
                </View>
            </View>
            <Text style={styles.plot}>{movie.Plot}</Text>
            <Text style={styles.year}>Actors: {movie.Actors}</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
        backgroundColor: "#fff",
    },
    loadingContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#fff",
    },
    error: {
        padding: 20,
        textAlign: "center",
        color: "red",
        fontSize: 18,
    },
    detailsContainer: {
        flexDirection: "row",
        marginTop: 20,
        alignItems: "flex-start",
    },
    poster: {
        width: 150,
        height: 225,
        borderRadius: 8,
        marginRight: 20,
    },
    details: {
        flex: 1,
        justifyContent: "center",
        marginTop: 40,
    },
    title: {
        fontSize: 24,
        fontWeight: "bold",
        marginVertical: 8,
    },
    year: {
        fontSize: 16,
        color: "#666",
        marginBottom: 4,
    },
    director: {
        fontSize: 16,
        color: "#666",
        marginBottom: 8,
    },
    plot: {
        marginTop: 20,
        fontSize: 16,
        marginVertical: 8,
        backgroundColor: "#DCDCDC",
        padding: 10,
        borderRadius: 8,
    },
});
