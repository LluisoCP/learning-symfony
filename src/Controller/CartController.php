<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\Routing\Annotation\Route;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\IsGranted;
use Symfony\Component\HttpFoundation\Request;
use App\Repository\ProductRepository;
use App\Entity\Cart;

/**
 * @isGranted("ROLE_USER")
 */
class CartController extends AbstractController
{
    /**
     * @Route("/cart", name="cart")
     */
    public function index()
    {
        return $this->render('cart/cart.html.twig');
    }

    /**
     * @Route("/cart/add", name="add_to_cart", methods={"POST"})
     */
    public function addToCart(Request $request, ProductRepository $product_repository)
    {
        $user = $this->getUser();
        $amount = $request->request->get('amount');
        $product = $product_repository->find($request->request->get('product'));
        $cart = $user->findCart($product);
        $em = $this->getDoctrine()->getManager();
        if ($cart)
        {
            $quantity = $cart->getQuantity();
            $cart->setQuantity($quantity + $amount);
            $em->flush();
        }
        else
        {
            $cart = new Cart();
            $cart->setClient($user);
            $cart->setProduct($product);
            $cart->setQuantity($amount);
            $user->addCart($cart);

            $em->persist($cart);
            $em->flush();
        }

        return $this->render('cart/cart.html.twig', [
            'carts' => $user->getCarts()
        ]);
    }
}
