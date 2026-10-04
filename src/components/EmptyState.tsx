import React from 'react';
import { SapphireIcon } from './SapphireIcon';

export const EmptyState: React.FC = () => {
  return (
    <div className="flex flex-1 flex-col items-center justify-center px-4 max-w-xl mx-auto w-full select-none">
      <div className="flex flex-col items-center text-center space-y-4">
        {/* Clean Sapphire Icon */}
        <div className="p-3 rounded-full bg-white/5 border border-white/10">
          <SapphireIcon size={44} glow={false} />
        </div>

        {/* Clean Single Prompt Text requested by user */}
        <h1 className="text-xl sm:text-2xl font-medium tracking-tight text-white">
          Асуух зүйлээ кириллээр бичиж үлдээнэ үү.
        </h1>
      </div>
    </div>
  );
};
