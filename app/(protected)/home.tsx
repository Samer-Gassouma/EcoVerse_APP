import React from 'react';
import { View, ScrollView, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useUser } from '@clerk/clerk-expo';
import { Text } from '~/components/ui/text';
import { Card } from '~/components/ui/card';
import { Button } from '~/components/ui/button';
import { Calendar, Trophy, Coins, ArrowUpRight, Clock } from 'lucide-react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { ThemeToggle } from '~/components/ThemeToggle';

const { width } = Dimensions.get('window');

interface EventCard {
    id: string;
    title: string;
    date: string;
    type: string;
    status: 'upcoming' | 'completed' | 'ongoing';
    points: number;
}

export default function HomeScreen() {
    const { user } = useUser();
    // Mock data
    const stats = [
        { title: 'Total Events', value: '12', icon: Calendar },
        { title: 'Total Points', value: '1,234', icon: Trophy },
        { title: 'EcoCoins', value: '500', icon: Coins },
    ];

    const events: EventCard[] = [
        {
            id: '1',
            title: 'Beach Cleanup Drive',
            date: '2024-03-20',
            type: 'Cleanup',
            status: 'ongoing',
            points: 100,
        },
        {
            id: '2',
            title: 'Tree Planting Event',
            date: '2024-03-25',
            type: 'Planting',
            status: 'upcoming',
            points: 150,
        },
        {
            id: '3',
            title: 'Recycling Drive',
            date: '2024-03-30',
            type: 'Recycling',
            status: 'completed',
            points: 200,
        },
        {
            id: '4',
            title: 'Eco-Friendly Workshop',
            date: '2024-04-05',
            type: 'Workshop',
            status: 'upcoming',
            points: 100,
        },
        {
            id: '5',
            title: 'Eco-Friendly Workshop',
            date: '2024-04-05',
            type: 'Workshop',
            status: 'completed',
            points: 100,
        }
    ];

    return (
        <SafeAreaView className="flex-1 bg-background">
            <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
                {/* Header */}
                <View className="flex-row justify-between items-center px-4 pt-4">
                    <View className="pr-4">
                        <Text className="text-2xl font-bold text-foreground">
                            Welcome back,
                        </Text>
                        <Text className="text-lg text-muted-foreground">
                            {user?.firstName || user?.emailAddresses[0].emailAddress}
                        </Text>
                    </View>
                    <ThemeToggle />
                </View>
                {/* Stats Cards */}
                <ScrollView
                    horizontal
                    className="px-4 mt-6"
                    showsHorizontalScrollIndicator={false}
                >
                    {stats.map((stat, index) => (
                        <Animated.View
                            entering={FadeInDown.delay(index * 100)}
                            key={stat.title}
                            style={{ width: width * 0.4 }}
                            className="mr-4"
                        >
                            <Card className="p-4 border-0 bg-card/90">
                                <stat.icon size={24} className="text-primary mb-2" />
                                <Text className="text-2xl font-bold text-foreground">
                                    {stat.value}
                                </Text>
                                <Text className="text-sm text-muted-foreground">
                                    {stat.title}
                                </Text>
                            </Card>
                        </Animated.View>
                    ))}
                </ScrollView>

                {/* Current Event */}
                <View className="px-4 mt-8">
                    <View className="flex-row justify-between items-center mb-4">
                        <Text className="text-lg font-semibold text-foreground">
                            Current Event
                        </Text>
                        <Button variant="ghost" className="h-8 px-2">
                            <Text className="text-primary text-sm mr-1">View All</Text>
                            <ArrowUpRight size={16} className="text-primary" />
                        </Button>
                    </View>

                    {events.filter(e => e.status === 'ongoing').map(event => (
                        <Card key={event.id} className="p-4 mb-4 border-0 bg-card/90">
                            <View className="flex-row justify-between items-start">
                                <View className="flex-1">
                                    <Text className="text-lg font-semibold text-foreground">
                                        {event.title}
                                    </Text>
                                    <View className="flex-row items-center mt-2">
                                        <Clock size={16} className="text-muted-foreground mr-2" />
                                        <Text className="text-sm text-muted-foreground">
                                            {new Date(event.date).toLocaleDateString()}
                                        </Text>
                                    </View>
                                </View>
                                <View className="bg-primary/10 px-3 py-1 rounded-full">
                                    <Text className="text-primary text-sm">
                                        {event.points} pts
                                    </Text>
                                </View>
                            </View>
                            <Button className="mt-4 h-10">
                                <Text className="text-primary-foreground">
                                    Continue Event
                                </Text>
                            </Button>
                        </Card>
                    ))}
                </View>

                {/* Past Events */}
                <View className="px-4 mt-8 pb-8">
                    <Text className="text-lg font-semibold text-foreground mb-4">
                        Past Events
                    </Text>
                    {events.filter(e => e.status === 'completed').map(event => (
                        <Card key={event.id} className="p-4 mb-4 border-0 bg-card/90">
                            <View className="flex-row justify-between items-center">
                                <View className="flex-1">
                                    <Text className="text-base font-medium text-foreground">
                                        {event.title}
                                    </Text>
                                    <Text className="text-sm text-muted-foreground mt-1">
                                        {new Date(event.date).toLocaleDateString()}
                                    </Text>
                                </View>
                                <View className="bg-muted/20 px-3 py-1 rounded-full">
                                    <Text className="text-muted-foreground text-sm">
                                        {event.points} pts
                                    </Text>
                                </View>
                            </View>
                        </Card>
                    ))}
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}
