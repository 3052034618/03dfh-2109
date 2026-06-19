import type { CompanionCard } from '../types/companion';

export const mockCompanionCards: CompanionCard[] = [
  {
    id: 'c1',
    publisherId: 'u1',
    publisherName: '剧本杀爱好者小明',
    publisherAvatar: 'https://picsum.photos/id/64/200/200',
    publisherWechat: 'xiaoming_jbs',
    publisherPhone: '138****1234',
    targetCity: '上海',
    scriptName: '惊华',
    scriptType: 'campaign',
    date: '2026-06-27',
    missingRoles: 3,
    totalRoles: 7,
    acceptShareRoom: true,
    acceptShareCar: true,
    budget: 800,
    description: '北京出发，周六早班机去上海，想打《惊华》，缺3个角色，接受拼房拼车，最好是有经验的玩家',
    companions: [
      {
        id: 'comp1',
        userId: 'u2',
        nickname: '小红',
        avatar: 'https://picsum.photos/id/91/200/200',
        intention: 'all',
        isConfirmed: true,
        city: '北京',
        wechatId: 'xiaohong_jbs',
        phone: '139****5678'
      },
      {
        id: 'comp2',
        userId: 'u3',
        nickname: '阿杰',
        avatar: 'https://picsum.photos/id/177/200/200',
        intention: 'travel',
        isConfirmed: false,
        city: '天津'
      }
    ],
    createdAt: '2026-06-15',
    status: 'open',
    tripId: 't1'
  },
  {
    id: 'c2',
    publisherId: 'u4',
    publisherName: '情感本玩家',
    publisherAvatar: 'https://picsum.photos/id/338/200/200',
    publisherWechat: 'qinggan_wan',
    publisherPhone: '137****9999',
    targetCity: '杭州',
    scriptName: '雾起云浮',
    scriptType: 'emotion',
    date: '2026-06-28',
    missingRoles: 3,
    totalRoles: 6,
    acceptShareRoom: true,
    acceptShareCar: false,
    budget: 600,
    description: '南京出发，坐高铁去杭州，想打《雾起云浮》，缺2女1男，不接受反串',
    companions: [
      {
        id: 'comp3',
        userId: 'u5',
        nickname: '小琳',
        avatar: 'https://picsum.photos/id/1027/200/200',
        intention: 'table',
        isConfirmed: true,
        city: '苏州',
        wechatId: 'xiaolin_jbs',
        phone: '136****1111'
      }
    ],
    createdAt: '2026-06-16',
    status: 'open',
    tripId: 't2'
  },
  {
    id: 'c3',
    publisherId: 'u6',
    publisherName: '硬核推土机',
    publisherAvatar: 'https://picsum.photos/id/237/200/200',
    publisherWechat: 'yinghe_tuiji',
    publisherPhone: '135****2222',
    targetCity: '北京',
    scriptName: '周公游记',
    scriptType: 'suspense',
    date: '2026-07-04',
    missingRoles: 4,
    totalRoles: 6,
    acceptShareRoom: false,
    acceptShareCar: true,
    budget: 1000,
    description: '上海飞北京打硬核本，缺4人，不接受拼房，可以一起打车去店里，预算充足，都是硬核玩家来',
    companions: [],
    createdAt: '2026-06-17',
    status: 'open'
  },
  {
    id: 'c4',
    publisherId: 'u7',
    publisherName: '欢乐喜剧人',
    publisherAvatar: 'https://picsum.photos/id/659/200/200',
    publisherWechat: 'huanle_xiju',
    publisherPhone: '134****3333',
    targetCity: '成都',
    scriptName: '金陵有座东君书院',
    scriptType: 'joy',
    date: '2026-07-05',
    missingRoles: 1,
    totalRoles: 6,
    acceptShareRoom: true,
    acceptShareCar: true,
    budget: 700,
    description: '重庆出发去成都，高铁1小时，就缺1个女生，一起玩欢乐本，气氛组就位',
    companions: [
      {
        id: 'comp4',
        userId: 'u8',
        nickname: '小花',
        avatar: 'https://picsum.photos/id/718/200/200',
        intention: 'all',
        isConfirmed: true,
        city: '重庆',
        wechatId: 'xiaohua_cd',
        phone: '133****4444'
      },
      {
        id: 'comp5',
        userId: 'u9',
        nickname: '阿强',
        avatar: 'https://picsum.photos/id/783/200/200',
        intention: 'room',
        isConfirmed: true,
        city: '重庆',
        wechatId: 'aqiang_cd',
        phone: '132****5555'
      },
      {
        id: 'comp6',
        userId: 'u10',
        nickname: '小美',
        avatar: 'https://picsum.photos/id/1025/200/200',
        intention: 'table',
        isConfirmed: true,
        city: '成都',
        wechatId: 'xiaomei_cd',
        phone: '131****6666'
      },
      {
        id: 'comp7',
        userId: 'u11',
        nickname: '小李',
        avatar: 'https://picsum.photos/id/64/200/200',
        intention: 'travel',
        isConfirmed: false,
        city: '绵阳'
      }
    ],
    createdAt: '2026-06-18',
    status: 'full'
  },
  {
    id: 'c5',
    publisherId: 'u12',
    publisherName: '胆大妄为',
    publisherAvatar: 'https://picsum.photos/id/1082/200/200',
    publisherWechat: 'danda_wangwei',
    publisherPhone: '130****7777',
    targetCity: '深圳',
    scriptName: '权倾天下',
    scriptType: 'campaign',
    date: '2026-07-11',
    missingRoles: 3,
    totalRoles: 8,
    acceptShareRoom: true,
    acceptShareCar: false,
    budget: 1200,
    description: '广州出发深圳，想打《权倾天下》大机制本，缺3人，可拼房，预算充足',
    companions: [
      {
        id: 'comp8',
        userId: 'u13',
        nickname: '大军',
        avatar: 'https://picsum.photos/id/1/200/200',
        intention: 'table',
        isConfirmed: true,
        city: '广州',
        wechatId: 'dajun_gz',
        phone: '159****8888'
      },
      {
        id: 'comp9',
        userId: 'u14',
        nickname: '阿伟',
        avatar: 'https://picsum.photos/id/2/200/200',
        intention: 'travel',
        isConfirmed: false,
        city: '佛山'
      }
    ],
    createdAt: '2026-06-19',
    status: 'open'
  }
];
