import { Test, TestingModule } from '@nestjs/testing';
import { CartService } from './cart.service';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCartMenuDto } from './dto/CreateCartMenu.dto';
import { query } from 'express';
import { BadRequestException, NotFoundException } from '@nestjs/common';

describe('CartService', () => {
  let service: CartService;
  let prismaService: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CartService, 
        {
          provide: PrismaService,
          useValue: {
            cart: {
              findFirst: jest.fn(),
              create: jest.fn(),
              delete: jest.fn(),
            },
            cartItem: {
              findFirst: jest.fn(),
              create: jest.fn(),
              delete: jest.fn(),
              update: jest.fn(),
            },
            $transaction: jest.fn()
          }
        }
      ],
    }).compile();

    service = module.get<CartService>(CartService);
    prismaService = module.get<PrismaService>(PrismaService)
  });
  const mockMenu = {
    id: 'ckwz9sj13000b08lcg4n92z2c',
    name: 'Margherita Pizza',
    HeaderPhoto: 'https://example.com/photos/margherita-pizza.jpg',
    description: 'Classic Margherita pizza with fresh basil and mozzarella.',
    price: 12.99,
    categoryId: 'ckwz9sj13000b08lcg4n92z2d',
    availability: true,
    restaurantId: 'ckwz9sj13000b08lcg4n92z2e',
    createdAt: new Date('2024-09-15T10:00:00Z'),
  };
  const mockUserId = 'adssakdakld';
  const mockRequest = { user: { sub: mockUserId } };
  const mockCart = { id: 'sdaldnaldn', userId: mockUserId, restaurantId: 'dsaodnainiw' }
  const mockBody: CreateCartMenuDto = { 
    price: 130,
    restaurantId: 'dsaodnainiw', 
    ifProductDoesnotExist: 'Remove it from my order',
    menuId: 'aksndisadian',
    instruction: '',
    quantity: 5
  } 
  const cartItem = {
    id: '231das',
    cartId: mockCart.id,
    menuId: mockBody.menuId,
    quantity: mockBody.quantity,
    price: mockBody.price,
    instruction: '',
    ifProductDoesnotExist: mockBody.ifProductDoesnotExist,
    cratedAt: '2024-09-15T14:00:00Z'
  }
  const mockReturnCart = {
    ...mockCart,
    cartItems: [
      {
        ...cartItem,
        menu: mockMenu
      }
    ]
  }  

  describe('getCartItem', () => {
    
    it('should return a data base on the params', async () => {
      const cartItemMenu = {
        ...cartItem,
        menu: mockMenu
      }

      prismaService.cartItem.findFirst = jest.fn().mockResolvedValue(cartItemMenu);

      const result = await service.getCartItem(cartItemMenu.id)

      expect(prismaService.cartItem.findFirst).toHaveBeenCalledWith({
        where: { id: cartItemMenu.id },
        include: { menu: true }
      })
      expect(result).toBeDefined()
      expect(result).toEqual(cartItemMenu)
    })

    it('should throw Not Found Exception when cartitemId does not exist in the database', async () => {

      prismaService.cartItem.findFirst = jest.fn().mockResolvedValue(null)

      await expect(service.getCartItem('non existing id')).rejects.toThrow(
        new NotFoundException('Cart item not found')
      )

    })

    it('should throw bad Request Exception when cartItemId is empty', async () => {
      
      await expect(service.getCartItem('')).rejects.toThrow(
        new BadRequestException('cartItemId is empty')
      );

    })

  })

  describe('addCart', () => {

    it('should create a cart if it does not exist', async () => {

      prismaService.cart.findFirst = jest.fn().mockResolvedValue(null) // we will simulate if it does not exist
      prismaService.cart.create = jest.fn().mockResolvedValue(mockCart);
      prismaService.$transaction = jest.fn().mockResolvedValue({
        ...cartItem,
        menu: mockMenu
      })

      const result = await service.addCart(mockBody, mockRequest);

      expect(prismaService.cart.findFirst).toHaveBeenCalledWith({ where: { userId: mockUserId } })
      expect(prismaService.cart.create).toHaveBeenCalledWith({
        data: { restaurantId: mockBody.restaurantId, userId: mockUserId }
      });
      expect(prismaService.$transaction).toHaveBeenCalled()

      expect(result).toBeDefined()
      expect(result).toEqual({
        ...mockCart,
        cartItems: [
          {
            ...cartItem,
            menu: mockMenu
          }
        ]
      })
    })

    it('should just use the cart if it exist, and not call create nor make a new one', async () => {

      prismaService.cart.findFirst = jest.fn().mockResolvedValue(mockCart)
      prismaService.$transaction = jest.fn().mockResolvedValue({
        ...cartItem,
        menu: mockMenu
      })

      const result = await service.addCart(mockBody, mockRequest)

      expect(prismaService.cart.findFirst).toHaveBeenCalledWith({ where: { userId: mockUserId } })
      expect(prismaService.$transaction).toHaveBeenCalled()

      expect(result).toBeDefined()
      expect(result).toEqual({
        ...mockCart,
        cartItems: [
          {
            ...cartItem,
            menu: mockMenu
          }
        ]
      })
    })

    it("should create a new one when it's a different restaurantId", async () => {
      const differentRestaurantId = ',1mb312io3opiasd'
      const cartNewlyCreatedId = 'a0s9da9dsanmlkiomsopikw'
      const newBody = {
        ...mockBody,
        restaurantId: differentRestaurantId
      }

      prismaService.cart.findFirst = jest.fn().mockResolvedValue(mockCart)
      prismaService.cart.delete = jest.fn().mockResolvedValue(mockCart)
      prismaService.cart.create = jest.fn().mockResolvedValue({
        restaurantId: differentRestaurantId,
        id: cartNewlyCreatedId,
        userId: mockUserId
      })
      prismaService.$transaction = jest.fn().mockResolvedValue({
        ...cartItem,
        menu: mockMenu
      })
      

      const result = await service.addCart(newBody, mockRequest)
      
      expect(prismaService.cart.findFirst).toHaveBeenCalledWith({ where: {userId: mockUserId} });
      // expect to delete the current cart and also make a new one
      expect(prismaService.cart.delete).toHaveBeenCalled();
      expect(prismaService.cart.create).toHaveBeenCalledWith({
        data: { restaurantId: differentRestaurantId, userId: mockUserId }
      })
      expect(prismaService.$transaction).toHaveBeenCalled()
      
      expect(result).toBeDefined()
      expect(result).toEqual({
        ...mockCart,
        id: cartNewlyCreatedId,
        restaurantId: differentRestaurantId,
        cartItems: [
          {
            ...cartItem,
            menu: mockMenu
          }
        ]
      })
    })

  })
  
  describe('getCurrentId', () => {

    it('should return a currentCart', async () => {
      prismaService.cart.findFirst = jest.fn().mockResolvedValue(mockReturnCart)

      const result = await service.getCurrentCart(mockRequest);
      
      expect(prismaService.cart.findFirst).toHaveBeenCalledWith({
        where: { userId: mockUserId },
        include: { 
          cartItems: { 
            include: { 
              menu: true 
            } 
          },
          restaurant: {
            select: {
              name: true,
              address: true,
              HeaderPhoto: true,
              email: true,
              latitude: true,
              longitude: true
            }
          }
        }
      })

      expect(result).toBeDefined()
      expect(result).toEqual(mockReturnCart)
    })
  })

  describe('updateCart', () => {
    const idtoBeUpdate = cartItem.id

    it('should update normaly', async () => {
      const query = { quantity: 4 }
      prismaService.cartItem.update = jest.fn().mockResolvedValue({
        ...cartItem,
        menu: mockMenu,
        ...query
      })

      const result = await service.updateCart(query, idtoBeUpdate)
 
      expect(prismaService.cartItem.update).toHaveBeenCalledWith({
        where: { id: idtoBeUpdate },
        data: { ...query },
        include: { menu: true }
      })
      expect(result).toBeDefined()
      expect(result).toEqual({
        ...cartItem, 
        menu: mockMenu,
        ...query
      })
    })

    it('should delete if quantity is gonna equal to 0', async () => {
      const query = {
        quantity: 0,
        instruction: 'hello world'
      }

      prismaService.cartItem.delete = jest.fn().mockResolvedValue(cartItem)

      const result = await service.updateCart(query, idtoBeUpdate)

      expect(prismaService.cartItem.delete).toHaveBeenCalledWith({
        where: { id: idtoBeUpdate }
      })
      expect(result).toEqual(cartItem)
    })

  })

  describe('deleteMenuCart', () => {
    const toDeleteId = cartItem.id

    it('it should delete id', async () => {
      prismaService.cartItem.delete = jest.fn().mockReturnValue(cartItem)
      
      const result = await service.deleteMenuCart(toDeleteId)

      expect(prismaService.cartItem.delete).toHaveBeenCalledWith({
        where: { id: toDeleteId }
      })
      expect(result).toEqual(cartItem)
    })
  })
});