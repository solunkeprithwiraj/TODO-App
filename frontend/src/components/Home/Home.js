import React from "react";
import { useState } from "react";
import "./Home.css";

export default function Home() {
  const user = localStorage.getItem("user")
    ? JSON.parse(localStorage.getItem("user"))
    : "Guest";
  return (
    <>
    <div className="welcome text-center">
      <h1>  Welcome {user.name}</h1>
      </div>
      
      <div className="text">
        <p>Lorem ipsum dolor sit amet consectetur adipisicing elit.  Excepturi eaque dignissimos odit velit. Architecto exercitationem laborum assumenda minus, omnis fugit consequuntur? Saepe iure aspernatur vitae pariatur vel magnam fugiat eveniet!
        Totam, explicabo animi! Enim maiores sequi quasi! Dolor neque, molestiae molestias eum eligendi necessitatibus libero eveniet commodi obcaecati odit reiciendis, vero laudantium suscipit voluptate autem dolorum explicabo voluptatem corrupti officiis.
        Ex est ad assumenda deleniti corporis laborum, sint, corrupti accusamus ab explicabo libero, laboriosam consequuntur minus? Tempore incidunt iste error ipsam expedita sint atque ipsa, consectetur ab doloremque dicta nihil.
        Quam, voluptatem dicta. <br />Quidem, omnis impedit, ipsam illo nisi in, iusto eveniet quis qui non doloribus! Voluptates molestiae modi, enim debitis omnis corrupti, deserunt ad eaque eligendi dolorem voluptate similique.
        Ipsum nostrum vitae voluptatibus consequatur eius saepe deserunt porro facere iusto reiciendis harum ea similique aliquid odio aut culpa, officiis praesentium quia cum blanditiis. Quasi fuga hic obcaecati veritatis nemo.
        Totam delectus magni minus id impedit voluptatum. <br /> Nisi voluptatibus laudantium accusamus magnam assumenda id similique doloribus aspernatur. Repellat, libero velit? Pariatur ullam tempore esse, minus ea natus dignissimos iure incidunt.
          Recusandae deleniti voluptas nemo rerum eum aperiam dolores soluta, minima ducimus eos porro odio a.
        <br />  Odio, repellendus quibusdam autem molestias expedita voluptatem sunt facere? Eveniet quidem placeat mollitia molestiae possimus!
        Odit aut eum provident ab sequi iste temporibus quam numquam quod porro natus eius nobis esse debitis ea similique repellendus dolore, ullam quidem dolorem fugiat? Voluptatibus quaerat ea autem sunt!
        Ipsam cupiditate ex, delectus optio exercitationem quibusdam ipsa similique laborum quis doloremque recusandae eius, placeat consequatur. Aut cum nam, omnis laboriosam corporis odit adipisci obcaecati culpa, similique aliquam nisi ipsum!
        Quia repudiandae, distinctio neque ullam corporis delectus? Consequatur esse molestiae ducimus sint blanditiis maxime, eligendi culpa voluptas sequi. Natus architecto necessitatibus officia quibusdam vero numquam quis nobis, rerum sapiente aut!
        Autem excepturi ipsam molestiae ullam, ea sit harum repudiandae tempore sapiente natus! Sit ullam porro hic, repudiandae labore ipsa perspiciatis itaque accusantium dolor alias animi voluptatibus amet distinctio error nulla.
        Commodi eligendi quae magnam, quam necessitatibus, illum facere, amet sequi maiores beatae sint ab quasi? Repellendus iste obcaecati ut in veritatis mollitia ipsa, fugit optiow? </p>
      </div>
    </>
  );
}
