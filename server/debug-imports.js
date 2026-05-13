console.log('Importing express...')
const express = require('express')
console.log('Importing body-parser...')
const bodyParser = require('body-parser')
console.log('Importing cors...')
const cors = require('cors')
console.log('Importing jsonwebtoken...')
const jwt = require('jsonwebtoken')
console.log('Importing ethers...')
const { ethers } = require('ethers')
console.log('Importing @prisma/client...')
try {
  const { PrismaClient } = require('@prisma/client')
  console.log('PrismaClient imported')
} catch (e) {
  console.log('PrismaClient import failed')
}
console.log('All imports done!')
