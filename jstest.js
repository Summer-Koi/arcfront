const a = [
  {
    ch_n:'1',
    ch_s:[
      {
        id:'11'
      },
      {
        id:'22'
      }
    ]
  },
  {
    ch_n:'2',
    ch_s:[
      {
        id:'33'
      },
      {
        id:'44'
      }
    ]
  }
]

for (i = 0; i < a.length; i++){
  console.log(...a[i].ch_s)
}

