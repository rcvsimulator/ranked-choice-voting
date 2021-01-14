import { Component } from '@angular/core';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  votingOptions = ['Option 1', 'Option 2', 'Option 3'];
  votingPool = [];
  votingPoolTitles = [];
  currentVotingList = 0;
  winner = null;

  ngOnInit() {
    this.increasePool();
    this.increasePool();
  }

  drop(event: CdkDragDrop<string[]>, list: any[]) {
    moveItemInArray(list, event.previousIndex, event.currentIndex);
  }

  nextVoter() {
    this.currentVotingList += 1;
  }

  prevVoter() {
    this.currentVotingList -= 1;
  }

  listChanged() {
    //console.log(this.votingOptions);
    //console.log(this.votingPool);
  }

  increasePool() {
    let votingList = []
    for (let i = 0; i < this.votingOptions.length; i++) {
      votingList.push(i);
    }
    this.votingPool.push(votingList);
  }

  decreasePool() {
    if (this.votingPool.length > 2) {
      this.votingPool.pop();
    }
  }

  increaseOptions() {
    for (let i = 0; i < this.votingPool.length; i++) {
      this.votingPool[i].push(this.votingOptions.length);
    }
    this.votingOptions.push('Option ' + (this.votingOptions.length + 1));
  }

  decreaseOptions() {
    if (this.votingOptions.length > 3) {
      this.votingOptions.pop();
      for (let i = 0; i < this.votingPool.length; i++) {
        this.votingPool[i] = this.votingPool[i].filter(z => z != this.votingOptions.length);
      }
    }
  }

  trackByFn(index: any, item: any) {
    return index;
  }

  calculateWinner(eliminated: number[]) {
    let percentages = this.calculatePercentages(eliminated);
    //console.log(percentages);
    let largest = 0;
    let smallest = percentages.findIndex(z => z > 0);
    for (let i = 0; i < percentages.length; i++) {
      if (percentages[i] > percentages[largest]) {
        largest = i;
      }
      if (percentages[i] <= percentages[smallest] && !eliminated.includes(i)) {
        smallest = i;
      }
    }
    let allSmallest = percentages.map((z, i) => {
      if (z == percentages[smallest]) {
        return i
      }
      return -1;
    }).filter(z => z != -1);
    let lot = Math.floor(Math.random() * allSmallest.length);
    // Need to check for ties
    // Resolve ties by using random chance
    if (percentages[largest] > 50) {
      //console.log("Winner is " + this.votingOptions[largest]);
      this.winner = this.votingOptions[largest];
    }
    else {
      this.calculateWinner(eliminated.concat([allSmallest[lot]]));
    }
  }

  calculatePercentages(eliminated: number[]) {
    let percentages = []
    for (let i = 0; i < this.votingOptions.length; i++) {
      percentages.push(0);
    }
    for (let i = 0; i < this.votingPool.length; i++) {
      percentages[this.votingPool[i].find(z => !eliminated.includes(z))] += 1;
    }
    return percentages.map(z => 100 * z / this.votingPool.length);
  }
}
