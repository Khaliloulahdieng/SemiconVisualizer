import { Topic } from '@/lib/types';
import mosfetData from '@/data/topics/devices/mosfet.json';

const topics: Record<string, Topic> = {
  'nmos-transistor': mosfetData as Topic,
  // Add more topics here as we create them
};

export function loadTopic(topicId: string): Topic | null {
  return topics[topicId] || null;
}

export function getAllTopicIds(): string[] {
  return Object.keys(topics);
}