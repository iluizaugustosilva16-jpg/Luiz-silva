import React from 'react';
import { stories } from '../data/mockData';
import { Story } from '../types';
import { PlusCircleIcon } from './Icons';

const StoryItem: React.FC<{ story: Story }> = ({ story }) => (
  <div className="flex-shrink-0 flex flex-col items-center space-y-1">
    <div className="w-16 h-16 rounded-full p-0.5 bg-gradient-to-br from-fuchsia-500 to-purple-600">
      <img src={story.user.avatar} alt={story.user.name} className="w-full h-full rounded-full border-2 border-white dark:border-black object-cover" />
    </div>
    <span className="text-xs text-gray-700 dark:text-gray-300">{story.user.name}</span>
  </div>
);

const AddStory: React.FC = () => (
    <div className="flex-shrink-0 flex flex-col items-center space-y-1">
      <div className="w-16 h-16 rounded-full p-0.5 bg-gray-200 dark:bg-gray-800 flex items-center justify-center">
        <PlusCircleIcon className="w-8 h-8 text-gray-400 dark:text-gray-500" />
      </div>
      <span className="text-xs text-gray-500 dark:text-gray-500">Add new</span>
    </div>
);


const StoryCarousel: React.FC = () => {
  return (
    <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-800">
      <div className="flex space-x-4 overflow-x-auto pb-2 -mb-2">
        <AddStory />
        {stories.map(story => <StoryItem key={story.id} story={story} />)}
      </div>
    </div>
  );
};

export default StoryCarousel;