import mongoose from "mongoose";
const {Schema} = mongoose;
const problemSchema = new Schema({
    title:{
        type:String,
        required: true
    },
    description:{
        type: String,
        required: true
    },
    difficulty:{
        type:String,
        enum:['easy','medium','hard'],
        required:true
    },
    points:{
        type : Number,
        default:5,
    },
    tags: [
  {
    type: String,
    required: true,
    enum: [
      "array",
      "linkedList",
      "graph",
      "dp",
      "string",
      "twoPointers",
      "tree",
      "matrix",
      "sorting",
      "binarySearch",
      "recursion",
      "backtracking",
      "greedy",
      "stack",
      "queue",
      "heap",
      "hashing",
      "bitManipulation",
      "slidingWindow",
      "prefixSum",
      "trie",
      "segmentTree",
      "disjointSet",
      "graphTraversal",
      "shortestPath",
      "minimumSpanningTree",
      "topologicalSort",
      "memoization",
      "tabulation",
      "intervals",
      "math",
      "geometry",
      "gameTheory",
      "randomized"
    ],
  },
],
    visibleTestcases:[
        {
            input:{
                type:String,
                required:true,
            },
            output:{
                type:String,
                required:true,
            },
            explaination:{
                type:String,
                required:true
            }
        }
    ],
    hiddenTestcases:[
        {
            input:{
                type:String,
                required:true,
            },
            output:{
                type:String,
                required:true,
            }
        }
    ],
    startCode:[
        {
            language:{
                type:String,
                required:true
            },
            initialCode:{
                type:String,
                required:true
            }
        }
    ],
    referenceSolution:[
        {
            language:{
                type:String,
                required:true
            },
            completeCode:{
                type:String,
                required:true
            }
        }
    ],
    problemCreator:{
        type:Schema.Types.ObjectId,
        ref:'user',
        required:true
    }
})
const Problem = mongoose.model('Problem',problemSchema);
export default Problem;
const referenceSolution = [
    {
        language:"c++",
        completeCode:"c++ Code"
    },
    {
        language:"java",
        completeCode:"java Code"
    },
    {
        language:"js",
        completeCode:"JS Code"
    }
]