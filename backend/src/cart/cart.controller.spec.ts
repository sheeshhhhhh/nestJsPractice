import { Test, TestingModule } from '@nestjs/testing';
import { CartController } from './cart.controller';
import { CartService } from './cart.service';
import { CreateCartMenuDto } from './dto/CreateCartMenu.dto';

import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { isCustomer } from '../guards/isCustomer.guard';
import { UpdateCartMenuDto } from './dto/UpdateCartMenu.Dto';

describe('CartController', () => {
  let controller: CartController;
  let service: CartService;
  
  // guards
  let jwtAuthGuard: JwtAuthGuard;
  let iscustomer: isCustomer

  //mock the guard at the top level
  beforeAll(() => {
    jwtAuthGuard = {
      canActivate: jest.fn()
    } as unknown as JwtAuthGuard

    iscustomer = {
      canActivate: jest.fn()
    } as unknown as isCustomer

  })

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [
        CartController
      ],
      providers: [
        {
          provide: CartService,
          useValue: {
            addCart: jest.fn(),
            getCurrentCart: jest.fn(),
            updateCart: jest.fn(),
            deleteMenuCart: jest.fn(),
            getCartItem: jest.fn(),
          }
        },
        {
          provide: JwtAuthGuard,
          useValue: jwtAuthGuard
        },
        {
          provide: isCustomer,
          useValue: iscustomer
        }
      ]
    }).compile();

    controller = module.get<CartController>(CartController);
    service = module.get<CartService>(CartService)
  });

  const mockRequest = { user: { id: 'mockUserId' } };
  const mockMenuId = '3213132'
  const mockRestaurantId = '1lasdopaidnaod'
  const mockBody: CreateCartMenuDto = {
    instruction: 'should not have any mayonaise',
    ifProductDoesnotExist: 'Remove it from my order',
    menuId: mockMenuId,
    restaurantId: mockRestaurantId,
    quantity: 5,
    price: 130
  }

  const mockCartItems = [
    {
      menu: {
        id: 'menu1',
        name: 'Cheeseburger',
        HeaderPhoto: 'https://example.com/cheeseburger.jpg',
        description: 'A delicious cheeseburger with all the fixings.',
        price: 9.99,
        categoryId: 'category1',
        availability: true,
        restaurantId: 'restaurant1',
        createdAt: new Date('2024-09-01T12:00:00Z'),
      },
      id: 'cartItem1',
      cartId: 'cart1',
      menuId: 'menu1',
      quantity: 2,
      price: 9.99,
      ifProductDoesnotExist: 'Remove it from my order',
      instruction: '',
      createdAt: new Date('2024-09-10T12:00:00Z')
    }
  ]
  const mockCart = {
    id: 'cart1',
    restaurantId: 'restaurant1',
    userId: 'user1',
    createdAt: new Date('2024-09-10T12:00:00Z'),
    updatedAt: new Date('2024-09-15T12:00:00Z'),
    cartItems: mockCartItems,
  }


  describe('getCartItem/:cartItemId', () => {
    it('should return cartItem data base on params', async () => {
      jwtAuthGuard.canActivate = jest.fn().mockResolvedValue(true);
      iscustomer.canActivate = jest.fn().mockResolvedValue(true);
      const mockResult = mockCartItems[0]

      jest.spyOn(service, 'getCartItem').mockResolvedValue(mockResult)

      const result = await controller.getCartItem(mockResult.id)

      expect(result).toBeDefined()
      expect(result).toEqual(mockResult)
      expect(service.getCartItem).toHaveBeenCalledWith(mockResult.id)
    })
  })

  describe('addCart', () => {
    it('should return results from CartService.addCart', async () => {
      jwtAuthGuard.canActivate = jest.fn().mockResolvedValue(true);
      iscustomer.canActivate = jest.fn().mockResolvedValue(true);
      const mockResult = mockCart

      jest.spyOn(service, 'addCart').mockResolvedValue(mockResult)

      const result = await controller.addCart(mockBody, mockRequest)

      expect(result).toBeDefined()
      expect(result).toEqual(mockResult)
      expect(service.addCart).toHaveBeenCalledWith(mockBody, mockRequest)
    })
  })

  describe('getCurrentCart', () => {
    it('should return the current cart of the user', async () => {
      jwtAuthGuard.canActivate = jest.fn().mockResolvedValue(true);
      iscustomer.canActivate = jest.fn().mockResolvedValue(true);
      const mockresult = {
        ...mockCart,
        restaurant: {
          name: 'Mock Restaurant',
          address: '123 Mock Street, Mock City, Country',
          HeaderPhoto: 'https://example.com/mock-image.jpg',
          email: 'mockrestaurant@example.com',
          latitude: 14.5995, // Example latitude value
          longitude: 120.9842 // Example longitude value
          }
        }

      jest.spyOn(service, 'getCurrentCart').mockResolvedValue(mockresult)

      const result = await controller.getCurrentCart(mockRequest)

      expect(result).toBeDefined()
      expect(result).toEqual(mockresult)
      expect(service.getCurrentCart).toHaveBeenCalledWith(mockRequest)
    })
  })

  describe('update cartItem', () => {
    it('should return an updated cartItem', async () => {
      jwtAuthGuard.canActivate = jest.fn().mockResolvedValue(true);
      iscustomer.canActivate = jest.fn().mockResolvedValue(true);
      const mockresult = mockCartItems[0]
      const updateMockBody = {
        ...mockBody,
        quantity: 3
      } as UpdateCartMenuDto
      
      jest.spyOn(service, 'updateCart').mockResolvedValue(mockresult);

      const result = await controller.updateCart(updateMockBody, mockMenuId)

      expect(result).toBeDefined()
      expect(result).toEqual(mockresult)
      expect(service.updateCart).toHaveBeenCalledWith(updateMockBody, mockMenuId)
    })
  })

  describe('delete cartItem', () => {
    it('should delete in the database and return the deleted Item', async () => {
      jwtAuthGuard.canActivate = jest.fn().mockResolvedValue(true);
      iscustomer.canActivate = jest.fn().mockResolvedValue(true);
      const { menu, ...mockcartItem } = mockCartItems[0] // include menu in the bracket to seperate it

      jest.spyOn(service, 'deleteMenuCart').mockResolvedValue(mockcartItem);

      const result = await controller.deleteMenuCart(mockMenuId)

      expect(result).toBeDefined()
      expect(result).toEqual(mockcartItem)
      expect(service.deleteMenuCart).toHaveBeenCalledWith(mockMenuId)
    })
  })

});
