import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TownBoardComponent } from './town-board/town-board';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, TownBoardComponent],
  template: `
    <div class="min-h-screen bg-gray-100 p-4">
      <div class="max-w-6xl mx-auto">
        <!-- <h1 class="text-3xl font-bold text-gray-800 mb-6">Driving School Town Board</h1> -->

        <div class="bg-white rounded-lg shadow-lg p-4 mb-6">
          <div class="aspect-[2/3] max-h-[600px] border border-gray-200 rounded">
            <app-town-board class="relative w-full h-full left-70 "></app-town-board>
          </div>
        </div>

        <div class="bg-white rounded-lg shadow-lg p-6">
          <h2 class="text-xl font-semibold text-gray-700 mb-4">Controls</h2>
          <div class="flex flex-wrap gap-4">
            <button
              class="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
            >
              Reset View
            </button>
            <button
              class="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition-colors"
            >
              Toggle Animations
            </button>
            <p class="text-gray-600 text-sm mt-2">
              Hover over roads, lanes, or arrows to see tooltips. Press ESC to clear highlights.
            </p>
          </div>
        </div>
      </div>
    </div>
  `,
})
export class AppComponent {
  title = 'Driving School Town Board';
}
