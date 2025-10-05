'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MoonIcon, SunIcon, RefreshIcon } from '@heroicons/react/24/solid';

type Player = 'X' | 'O' | null;
type BoardState = Player[];

const WINNING_COMBINATIONS = [
  [0, 1, 2], [3, 4, 5], [6, 7, 8],  // Rows
  [0, 3, 6], [1, 4, 7], [2, 5, 8],  // Columns
  [0, 4, 8], [2, 4, 6]  // Diagonals
];

export default function EpicTicTacToe() {
  const [board, setBoard] = useState<BoardState>(Array(9).fill(null));
  const [currentPlayer, setCurrentPlayer] = useState<Player>('X');
  const [winner, setWinner] = useState<Player>(null);
  const [darkMode, setDarkMode] = useState(false);
  const [score, setScore] = useState({ X: 0, O: 0 });

  const checkWinner = (boardState: BoardState): Player => {
    for (const combination of WINNING_COMBINATIONS) {
      const [a, b, c] = combination;
      if (boardState[a] && boardState[a] === boardState[b] && boardState[a] === boardState[c]) {
        return boardState[a];
      }
    }
    return null;
  };

  const computerMove = (boardState: BoardState): number => {
    const emptySquares = boardState.reduce((acc, cell, index) => 
      cell === null ? [...acc, index] : acc, [] as number[]);
    return emptySquares[Math.floor(Math.random() * emptySquares.length)];
  };

  const handleSquareClick = (index: number) => {
    if (board[index] || winner) return;

    const newBoard = [...board];
    newBoard[index] = currentPlayer;
    setBoard(newBoard);

    const newWinner = checkWinner(newBoard);
    if (newWinner) {
      setWinner(newWinner);
      setScore(prev => ({ ...prev, [newWinner]: prev[newWinner] + 1 }));
      return;
    }

    if (newBoard.every(square => square !== null)) {
      setWinner('draw');
      return;
    }

    // Computer's turn
    const computerSquare = computerMove(newBoard);
    newBoard[computerSquare] = 'O';
    setBoard(newBoard);

    const computerWinner = checkWinner(newBoard);
    if (computerWinner) {
      setWinner(computerWinner);
      setScore(prev => ({ ...prev, [computerWinner]: prev[computerWinner] + 1 }));
    } else if (newBoard.every(square => square !== null)) {
      setWinner('draw');
    }
  };

  const resetGame = () => {
    setBoard(Array(9).fill(null));
    setWinner(null);
    setCurrentPlayer('X');
  };

  return (
    <div className={`min-h-screen p-4 flex items-center justify-center transition-all duration-300 ${darkMode ? 'bg-gray-900 text-white' : 'bg-white text-black'}`}>
      <motion.div 
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center max-w-md w-full"
      >
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold">🎮 Tic Tac Toe</h1>
          <div className="flex items-center space-x-4">
            <motion.button 
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => setDarkMode(!darkMode)} 
              className="p-2 rounded-full bg-gray-200 dark:bg-gray-700"
            >
              {darkMode ? <SunIcon className="h-6 w-6 text-yellow-500" /> : <MoonIcon className="h-6 w-6 text-purple-500" />}
            </motion.button>
            <motion.button 
              whileHover={{ rotate: 180 }}
              onClick={resetGame}
              className="p-2 rounded-full bg-gray-200 dark:bg-gray-700"
            >
              <RefreshIcon className="h-6 w-6" />
            </motion.button>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4 mb-8">
          {board.map((square, index) => (
            <motion.div
              key={index}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleSquareClick(index)}
              className={`
                h-24 flex items-center justify-center text-6xl font-bold
                border-4 rounded-xl cursor-pointer transition-all
                ${darkMode ? 'border-gray-700 bg-gray-800' : 'border-gray-300 bg-gray-100'}
                ${square === 'X' ? 'text-blue-500' : 'text-red-500'}
              `}
            >
              <AnimatePresence>
                {square && (
                  <motion.span
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.5 }}
                  >
                    {square}
                  </motion.span>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>

        {winner && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-2xl font-bold mb-4"
          >
            {winner === 'draw' ? '🤝 Ничья!' : `🏆 Победа: ${winner}`}
          </motion.div>
        )}

        <div className="flex justify-between text-xl">
          <div>
            <span className="text-blue-500">X:</span> {score.X}
          </div>
          <div>
            <span className="text-red-500">O:</span> {score.O}
          </div>
        </div>
      </motion.div>
    </div>
  );
}