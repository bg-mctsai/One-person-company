
export interface Scene {
  title: string;
  images: string[];
  dialogue: string[];
}

export const scenes: Scene[] = [
  {
    title: '場景一：被同事孤立',
    images: [
      '/images/scene1-image1.svg',
      '/images/scene1-image2.svg',
      '/images/scene1-image3.svg',
      '/images/scene1-image4.svg',
    ],
    dialogue: [
      '他們又背著我討論事情了...',
      '為什麼總是不揪我？',
      '我做錯了什麼嗎？',
      '算了，一個人也挺好。',
    ],
  },
  {
    title: '場景二：被老闆 PUA',
    images: [
      '/images/scene2-image1.svg',
      '/images/scene2-image2.svg',
      '/images/scene2-image3.svg',
      '/images/scene2-image4.svg',
    ],
    dialogue: [
      '你很有潛力，但還可以做得更好。',
      '這個專案很重要，只有你能勝任。',
      '年輕人不要計較那麼多，多學點東西。',
      '你確定這是你的極限了嗎？',
    ],
  },
  {
    title: '場景三：愛情只是交易',
    images: [
      '/images/scene3-image1.svg',
      '/images/scene3-image2.svg',
      '/images/scene3-image3.svg',
      '/images/scene3-image4.svg',
    ],
    dialogue: [
      '你愛我，就應該為我付出。',
      '我們之間，還談什麼錢？',
      '你看看別人家的男/女朋友。',
      '我累了，我們就這樣吧。',
    ],
  },
  {
    title: '場景四：被榨乾的一天',
    images: [
      '/images/scene4-image1.svg',
      '/images/scene4-image2.svg',
      '/images/scene4-image3.svg',
      '/images/scene4-image4.svg',
    ],
    dialogue: [
      '為什麼我總是這麼累？',
      '想找個人說說話，卻不知道打給誰。',
      '鏡子裡的人，是誰？',
      '手機，是我唯一的朋友。',
    ],
  },
  {
    title: '場景五：你只是工具',
    images: [
      '/images/scene5-image1.svg',
      '/images/scene5-image2.svg',
      '/images/scene5-image3.svg',
      '/images/scene5-image4.svg',
    ],
    dialogue: [
      '爸媽，我回來了。',
      '他們只關心我的成就，不關心我的人。',
      '我到底是什麼？',
      '也許，我只是一個滿足他們期望的工具。',
    ],
  },
  {
    title: '場景六：被世界拋棄',
    images: [
      '/images/scene6-image1.svg',
      '/images/scene6-image2.svg',
      '/images/scene6-image3.svg',
      '/images/scene6-image4.svg',
    ],
    dialogue: [
      '這個世界，沒有我的容身之處。',
      '為什麼沒有人理解我？',
      '他們都在笑我。',
      '結束，也許是新的開始。',
    ],
  },
];
