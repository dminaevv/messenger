import React, { ReactNode } from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';

interface ErrorBoundaryProps {
    children: ReactNode;
}

interface ErrorBoundaryState {
    hasError: boolean;
    error: Error | null;
}

class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
    constructor(props: ErrorBoundaryProps) {
        super(props);
        this.state = { hasError: false, error: null };
    }

    static getDerivedStateFromError(error: Error): ErrorBoundaryState {
        return { hasError: true, error };
    }

    componentDidCatch(error: Error, errorInfo: any) {
        console.error('Error captured in ErrorBoundary:', error, errorInfo);
    }

    handleReset = () => {
        this.setState({ hasError: false, error: null });
    };

    render() {
        if (this.state.hasError) {
            return (
                <View style={styles.container}>
                    <Text style={styles.errorText}>Произошла ошибка! 😢</Text>
                    <Text style={styles.errorDetails}>{this.state.error?.message}</Text>
                    <Button title="Перезагрузить" onPress={this.handleReset} />
                </View>
            );
        }

        return this.props.children;
    }
}

const styles = StyleSheet.create({
    container: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    errorText: { color: 'red', fontSize: 18, fontWeight: 'bold' },
    errorDetails: { color: 'gray', marginVertical: 10 },
});

export default ErrorBoundary;
