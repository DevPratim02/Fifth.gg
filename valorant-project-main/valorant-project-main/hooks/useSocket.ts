import { useEffect, useRef, useState } from 'react';
import { io, Socket } from 'socket.io-client';

const SOCKET_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

export const useSocket = () => {
    const [isConnected, setIsConnected] = useState(false);
    const socketRef = useRef<Socket | null>(null);

    useEffect(() => {
        // Initialize socket connection
        socketRef.current = io(SOCKET_URL, {
            transports: ['websocket', 'polling'],
            reconnection: true,
            reconnectionAttempts: 5,
            reconnectionDelay: 1000,
        });

        const socket = socketRef.current;

        // Connection event handlers
        socket.on('connect', () => {
            console.log('Socket connected:', socket.id);
            setIsConnected(true);
        });

        socket.on('disconnect', () => {
            console.log('Socket disconnected');
            setIsConnected(false);
        });

        socket.on('connect_error', (error) => {
            console.error('Socket connection error:', error);
            setIsConnected(false);
        });

        // Cleanup on unmount
        return () => {
            if (socket) {
                socket.disconnect();
            }
        };
    }, []);

    return {
        socket: socketRef.current,
        isConnected,
    };
};

// Matchmaking hook
export const useMatchmaking = (userId: number | null) => {
    const { socket, isConnected } = useSocket();
    const [matchStatus, setMatchStatus] = useState<'idle' | 'searching' | 'found' | 'accepted' | 'started'>('idle');
    const [currentMatch, setCurrentMatch] = useState<any>(null);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!socket || !userId) return;

        // Matchmaking event listeners
        socket.on('match:joined', (data) => {
            console.log('Joined matchmaking queue:', data);
            setMatchStatus('searching');
            setError(null);
        });

        socket.on('match:found', (data) => {
            console.log('Match found:', data);
            setMatchStatus('found');
            setCurrentMatch(data);
        });

        socket.on('match:player_accepted', (data) => {
            console.log('Player accepted:', data);
            setMatchStatus('accepted');
        });

        socket.on('match:started', (data) => {
            console.log('Match started:', data);
            setMatchStatus('started');
            setCurrentMatch(data);
        });

        socket.on('match:cancelled', (data) => {
            console.log('Match cancelled:', data);
            setMatchStatus('idle');
            setCurrentMatch(null);
            setError('Match was cancelled');
        });

        socket.on('match:error', (data) => {
            console.error('Match error:', data);
            setError(data.message || 'An error occurred');
            setMatchStatus('idle');
        });

        socket.on('match:ended', (data) => {
            console.log('Match ended by user:', data);
            setMatchStatus('idle');
            setCurrentMatch(null);
        });

        return () => {
            socket.off('match:joined');
            socket.off('match:found');
            socket.off('match:player_accepted');
            socket.off('match:started');
            socket.off('match:cancelled');
            socket.off('match:error');
            socket.off('match:ended');
        };
    }, [socket, userId]);

    const joinQueue = (gameMode: string, rankRange: string, region: string) => {
        if (socket && userId) {
            socket.emit('match:join', { userId, gameMode, rankRange, region });
        }
    };

    const leaveQueue = () => {
        if (socket && userId) {
            socket.emit('match:leave', { userId });
            setMatchStatus('idle');
            setCurrentMatch(null);
        }
    };

    const acceptMatch = (matchId: number) => {
        if (socket && userId) {
            socket.emit('match:accept', { matchId, userId });
        }
    };

    const declineMatch = (matchId: number) => {
        if (socket && userId) {
            socket.emit('match:decline', { matchId, userId });
            setMatchStatus('idle');
            setCurrentMatch(null);
        }
    };

    const endMatch = (matchId: number) => {
        if (socket && userId) {
            socket.emit('match:end', { matchId, userId });
        }
    };

    return {
        socket, // <--- Exposed
        isConnected,
        matchStatus,
        currentMatch,
        error,
        joinQueue,
        leaveQueue,
        acceptMatch,
        declineMatch,
        endMatch,
    };
};

// Chat hook
export const useChat = (roomId: string | null, userId: number | null, username: string | null) => {
    const { socket, isConnected } = useSocket();
    const [messages, setMessages] = useState<any[]>([]);
    const [typingUsers, setTypingUsers] = useState<string[]>([]);

    useEffect(() => {
        if (!socket || !roomId || !userId || !username) return;

        // Join chat room
        socket.emit('chat:join', { roomId, userId });

        // Chat event listeners
        socket.on('chat:history', (data) => {
            console.log('Chat history:', data);
            setMessages(data.messages || []);
        });

        socket.on('chat:message', (data) => {
            console.log('New message:', data);
            setMessages((prev) => [...prev, data]);
        });

        socket.on('chat:typing', (data) => {
            console.log('User typing:', data);
            if (data.isTyping && data.username !== username) {
                setTypingUsers((prev) => [...new Set([...prev, data.username])]);
            } else {
                setTypingUsers((prev) => prev.filter((u) => u !== data.username));
            }
        });

        // Cleanup
        return () => {
            socket.emit('chat:leave', { roomId, userId });
            socket.off('chat:history');
            socket.off('chat:message');
            socket.off('chat:typing');
        };
    }, [socket, roomId, userId, username]);

    const sendMessage = (message: string) => {
        if (socket && roomId && userId && username) {
            socket.emit('chat:message', { roomId, userId, username, message });
        }
    };

    const sendTyping = (isTyping: boolean) => {
        if (socket && roomId && userId && username) {
            socket.emit('chat:typing', { roomId, userId, username, isTyping });
        }
    };

    return {
        isConnected,
        messages,
        typingUsers,
        sendMessage,
        sendTyping,
    };
};
